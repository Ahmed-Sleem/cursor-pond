// Minimal fish-only runtime: three koi simulate at a fixed step and follow the pointer.
import { CANVAS_HEIGHT, CANVAS_WIDTH, FIXED_STEP, setCanvasSize } from './config';
import { KoiRenderer } from './koi-renderer';
import { School } from './school';
import { PRESETS, type FishPreset } from './effects';
import './styles.css';

const canvasElement = document.querySelector<HTMLCanvasElement>('#pond');
if (!canvasElement) throw new Error('Missing fish canvas.');
const canvas: HTMLCanvasElement = canvasElement;

const school = new School();
const renderer = new KoiRenderer(canvas);
const presetStripElement = document.querySelector<HTMLDivElement>('#presets');
const cellInputElement = document.querySelector<HTMLInputElement>('#cell-size');
const cellOutputElement = document.querySelector<HTMLOutputElement>('#cell-output');
if (!presetStripElement || !cellInputElement || !cellOutputElement) throw new Error('Missing appearance controls.');
const presetStrip: HTMLDivElement = presetStripElement;
const cellInput: HTMLInputElement = cellInputElement;
const cellOutput: HTMLOutputElement = cellOutputElement;
let activePreset: FishPreset = 'none';
let cellSize = Number(cellInput.value);

function applyAppearance(): void {
  renderer.setEffect(activePreset, cellSize);
  cellOutput.value = String(cellSize);
  presetStrip.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
    const selected = button.dataset.preset === activePreset;
    button.setAttribute('aria-checked', String(selected));
    button.classList.toggle('active', selected);
  });
}

for (const preset of PRESETS) {
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.preset = preset.id; button.setAttribute('role', 'radio');
  button.innerHTML = `<span aria-hidden="true">${preset.icon}</span>${preset.label}`;
  button.addEventListener('click', () => { activePreset = preset.id; applyAppearance(); });
  presetStrip.appendChild(button);
}
cellInput.addEventListener('input', () => { cellSize = Number(cellInput.value); applyAppearance(); });
applyAppearance();
let width: number = CANVAS_WIDTH, height: number = CANVAS_HEIGHT, last = performance.now(), accumulator = 0, elapsed = 0, frame = 0;
let releaseTimer = 0;

function resize(): void {
  const oldWidth = width, oldHeight = height;
  width = Math.max(1, innerWidth); height = Math.max(1, innerHeight);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  setCanvasSize(width, height);
  school.resize(width / Math.max(1, oldWidth), height / Math.max(1, oldHeight));
  renderer.resize(width, height, dpr);
}

function pointFromEvent(event: PointerEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) / rect.width * width, y: (event.clientY - rect.top) / rect.height * height };
}

function follow(event: PointerEvent): void {
  window.clearTimeout(releaseTimer);
  school.follow(pointFromEvent(event));
}

canvas.addEventListener('pointermove', follow, { passive: true });
canvas.addEventListener('pointerdown', event => { canvas.setPointerCapture(event.pointerId); follow(event); }, { passive: true });
canvas.addEventListener('pointerup', event => { canvas.releasePointerCapture(event.pointerId); releaseTimer = window.setTimeout(() => school.releaseTarget(), 900); }, { passive: true });
canvas.addEventListener('pointerleave', () => { releaseTimer = window.setTimeout(() => school.releaseTarget(), 900); });
addEventListener('resize', resize, { passive: true });

document.addEventListener('visibilitychange', () => { last = performance.now(); accumulator = 0; });

function loop(now: number): void {
  frame = requestAnimationFrame(loop);
  if (document.hidden) return;
  const delta = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now; accumulator += delta;
  while (accumulator >= FIXED_STEP) { elapsed += FIXED_STEP; school.update(FIXED_STEP, elapsed); accumulator -= FIXED_STEP; }
  renderer.draw(school);
}

resize();
frame = requestAnimationFrame(loop);

if (import.meta.hot) import.meta.hot.dispose(() => { cancelAnimationFrame(frame); });
