import { describe, expect, it } from 'vitest';
import { FIXED_STEP } from '../src/config';
import { School } from '../src/school';

describe('big-koi school extraction', () => {
  it('contains exactly three regular koi and no auxiliary schools', () => {
    const school = new School();
    expect(school.count).toBe(3);
    expect(school.fish).toHaveLength(3);
    expect('tinyFish' in school).toBe(false);
    expect('ripples' in school).toBe(false);
    expect(school.fish.every(fish => fish.bodyLength >= 58)).toBe(true);
  });

  it('steers the koi toward the live cursor target', () => {
    const school = new School();
    const before = school.fish.reduce((sum, fish) => sum + fish.position.x, 0) / school.count;
    school.follow({ x: 930, y: 300 });
    for (let step = 0; step < 240; step += 1) school.update(FIXED_STEP, step * FIXED_STEP);
    const after = school.fish.reduce((sum, fish) => sum + fish.position.x, 0) / school.count;
    expect(after).toBeGreaterThan(before + 35);
    expect(school.targetActive).toBe(true);
  });

  it('gives the follower, orbiter, and wanderer distinct cursor responses', () => {
    const school = new School();
    const target = { x: 480, y: 300 };
    for (let step = 0; step < 90; step += 1) {
      if (step % 20 === 0) school.follow(target);
      school.update(FIXED_STEP, step * FIXED_STEP);
    }
    const speeds = school.fish.map(fish => fish.speed);
    expect(new Set(speeds.map(speed => speed.toFixed(2))).size).toBe(3);
  });

  it('resolves body overlap instead of allowing koi to pass through each other', () => {
    const school = new School();
    school.fish.forEach(fish => { fish.position.x = 480; fish.position.y = 300; });
    school.update(FIXED_STEP, 0);
    for (let first = 0; first < school.count; first += 1) for (let second = first + 1; second < school.count; second += 1) {
      const dx = school.fish[first].position.x - school.fish[second].position.x;
      const dy = school.fish[first].position.y - school.fish[second].position.y;
      expect(Math.hypot(dx, dy)).toBeGreaterThan(24);
    }
  });

  it('scales fish positions and spines without resetting their state', () => {
    const school = new School();
    const before = { ...school.fish[0].position };
    school.resize(.5, 2);
    expect(school.fish[0].position.x).toBeCloseTo(before.x * .5);
    expect(school.fish[0].position.y).toBeCloseTo(before.y * 2);
    expect(school.count).toBe(3);
  });
});
