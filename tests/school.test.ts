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
