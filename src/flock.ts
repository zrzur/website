/**
 * The murmuration: one flock of starlings for the whole page, drawn on a fixed
 * canvas behind the content. A stage is an empty box in the page marked with
 * `data-flock`; the flock flies to the stage that fills the screen most and
 * takes that stage's shape.
 *
 *   data-flock="word"  data-words="a|b|c"  writes the words, one after another
 *   data-flock="wave"                      a moving voice wave
 *   data-tone="voice"                      the voice colour instead of the ink
 *
 * With prefers-reduced-motion the birds sit in their shape and never travel.
 * Stops when no stage is on screen or the tab is hidden.
 */

const STEP_MS = 1000 / 60;
const HOLD_MS = 6200;
const TAU = Math.PI * 2;

type Stage = { el: HTMLElement; box: DOMRect };
type Shape = { w: number; h: number; xs: Float32Array; ys: Float32Array };

export type Flock = {
  /** The flock writes this over the first stage for a while (the live demo) */
  say: (text: string) => void;
  /** Read stages, colours and sizes again (language or theme changed) */
  refresh: () => void;
  destroy: () => void;
};

/** How many birds fit this screen: a phone flies about 630, a wide desktop 2400 */
export function flockSize(width: number, height: number) {
  return Math.round(Math.min(2400, Math.max(420, (width * height) / 480)));
}

/** Evenly spaced points on the marked cells of a mask, exactly `count` of them */
export function sampleMask(
  filled: (x: number, y: number) => boolean,
  width: number,
  height: number,
  count: number,
  random: () => number = Math.random,
) {
  const area: number[] = [];
  for (let y = 0; y < height; y += 2)
    for (let x = 0; x < width; x += 2) if (filled(x, y)) area.push(x, y);
  const cells = area.length / 2;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  if (!cells) {
    for (let i = 0; i < count; i++) {
      xs[i] = random() * width;
      ys[i] = random() * height;
    }
    return { xs, ys };
  }
  // walking the cells with a fixed stride keeps the spacing even, the jitter
  // keeps it from looking like a printed grid
  const stride = cells / count;
  const jitter = Math.max(1, Math.sqrt(4 * stride) * 0.42);
  for (let i = 0; i < count; i++) {
    const at = Math.min(cells - 1, Math.floor((i + random()) * stride)) * 2;
    xs[i] = area[at] + (random() - 0.5) * jitter;
    ys[i] = area[at + 1] + (random() - 0.5) * jitter;
  }
  return { xs, ys };
}

const FONT = `"IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif`;

/** Lays a word into the box, as large as it fits, and samples it into points */
function wordShape(text: string, w: number, h: number, count: number, rtl: boolean): Shape {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(w));
  canvas.height = Math.max(1, Math.ceil(h));
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 100px ${FONT}`;
  const probe = ctx.measureText(text);
  const inkW = Math.max(1, probe.actualBoundingBoxLeft + probe.actualBoundingBoxRight);
  const inkH = Math.max(1, probe.actualBoundingBoxAscent + probe.actualBoundingBoxDescent);
  const size = Math.min((w * 0.98 * 100) / inkW, (h * 0.98 * 100) / inkH);
  ctx.font = `700 ${size}px ${FONT}`;
  const m = ctx.measureText(text);
  // centre the ink itself, not the advance box
  const y = (h - (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)) / 2 + m.actualBoundingBoxAscent;
  const x = w / 2 + (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2;
  ctx.fillStyle = "#000";
  ctx.fillText(text, x, y);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const { xs, ys } = sampleMask(
    (px, py) => data[(py * canvas.width + px) * 4 + 3] > 128,
    canvas.width,
    canvas.height,
    count,
  );
  return { w, h, xs, ys };
}

export function startFlock(canvas: HTMLCanvasElement): Flock {
  const ctx = canvas.getContext("2d")!;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let count = 0;
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let hx = new Float32Array(0); // heading, kept while a bird hovers
  let hy = new Float32Array(0);
  let wait = new Float32Array(0); // frames before a bird leaves for the new shape
  let seed = new Float32Array(0);
  let order = new Uint32Array(0);

  let stages: Stage[] = [];
  let active: Stage | null = null;
  let shapes = new Map<string, Shape>();
  const loading = new Set<string>();
  let shape: Shape | null = null;
  let spoken: string | null = null;
  let spokenTimer = 0;
  let wordIndex = 0;
  let wordTimer = 0;

  let frame = 0;
  let running = false;
  let last = 0;
  let clock = 0;
  let idle = 0;
  let sweep = -1;
  let nextSweep = 300;
  let sweepRtl = false;
  let measured = 0;
  let scale = 3;
  let seen = false;
  let falconX = -9999;
  let falconY = -9999;
  let ink = [240, 241, 248];
  let voice = [121, 224, 189];
  let colour = [...ink];

  function size() {
    const nextW = canvas.clientWidth;
    const nextH = canvas.clientHeight;
    if (nextW === width && nextH === height) return false;
    width = nextW;
    height = nextH;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const next = flockSize(width, height);
    if (next !== count) {
      const old = count;
      const grow = (from: Float32Array) => {
        const to = new Float32Array(next);
        to.set(from.subarray(0, Math.min(old, next)));
        return to;
      };
      px = grow(px);
      py = grow(py);
      vx = grow(vx);
      vy = grow(vy);
      hx = grow(hx);
      hy = grow(hy);
      wait = grow(wait);
      seed = grow(seed);
      order = new Uint32Array(next);
      for (let i = 0; i < next; i++) order[i] = i;
      for (let i = old; i < next; i++) {
        // they arrive from behind the top edge on the side the text starts
        px[i] = width * (0.2 + Math.random() * 0.6);
        py[i] = -40 - Math.random() * 240;
        vx[i] = (Math.random() - 0.5) * 2;
        vy[i] = 2 + Math.random() * 2;
        hx[i] = 0;
        hy[i] = 1;
        seed[i] = Math.random();
      }
      count = next;
    }
    return true;
  }

  function readColours() {
    const css = getComputedStyle(document.documentElement);
    const rgb = (name: string, fallback: number[]) => {
      const hex = css.getPropertyValue(name).trim().replace("#", "");
      if (hex.length !== 6) return fallback;
      return [0, 2, 4].map((at) => parseInt(hex.slice(at, at + 2), 16));
    };
    ink = rgb("--z-bird", ink);
    voice = rgb("--z-bird-voice", voice);
  }

  function readStages() {
    stages = [...document.querySelectorAll<HTMLElement>("[data-flock]")].map((el) => ({
      el,
      box: el.getBoundingClientRect(),
    }));
    measured = clock;
  }

  /** The stage that fills most of the screen, if any is on it */
  function pickStage() {
    let best: Stage | null = null;
    let bestArea = 0;
    for (const stage of stages) {
      stage.box = stage.el.getBoundingClientRect();
      const across = Math.min(stage.box.right, width) - Math.max(stage.box.left, 0);
      const down = Math.min(stage.box.bottom, height) - Math.max(stage.box.top, 0);
      const area = across > 0 && down > 0 ? across * down : 0;
      if (area > bestArea) {
        best = stage;
        bestArea = area;
      }
    }
    seen = best !== null;
    if (best && best.el !== active?.el) {
      active = best;
      wordIndex = 0;
      wordTimer = 0;
      changeShape(true);
    } else if (best) active = best;
    else if (active) active = stages.find((stage) => stage.el === active!.el) ?? null;
    // with no stage on screen the birds stay with the last one and leave with it
    return active;
  }

  function currentWord(stage: Stage) {
    if (spoken !== null && stage.el === stages[0]?.el) return spoken;
    const words = (stage.el.dataset.words ?? "").split("|").filter(Boolean);
    return words.length ? words[wordIndex % words.length] : "";
  }

  function wordOf(stage: Stage) {
    const box = stage.box;
    const text = currentWord(stage);
    if (!text) return null;
    const key = `${text}|${Math.round(box.width)}|${Math.round(box.height)}|${count}`;
    let found = shapes.get(key);
    if (!found) {
      needFont(text);
      found = wordShape(text, box.width, box.height, count, /[؀-ۿ]/.test(text));
      shapes.set(key, found);
    }
    return found;
  }

  /** Fonts load on demand: the word is laid again once its font has arrived */
  function needFont(text: string) {
    const font = `700 100px ${FONT}`;
    if (loading.has(text) || document.fonts.check(font, text)) return;
    loading.add(text);
    void document.fonts.load(font, text).then(() => {
      shapes = new Map();
      if (active) changeShape(false);
    });
  }

  function changeShape(travelled: boolean) {
    if (!active) return;
    const kind = active.el.dataset.flock;
    shape = kind === "word" ? wordOf(active) : null;
    if (shape) sortForShape(shape);
    // the word is written the way the page reads: birds bound for the start
    // of the line (the right in Arabic) leave first
    const rtl = readsRtl();
    const w = active.box.width || 1;
    for (let i = 0; i < count; i++) {
      if (still) wait[i] = 0;
      else if (shape) {
        const u = Math.min(1, Math.max(0, shape.xs[order[i]] / w));
        wait[i] = (rtl ? 1 - u : u) * 22 + seed[i] * 6;
      } else wait[i] = seed[i] * 8;
    }
    if (travelled && !still) {
      // anyone far off screen comes back in from the nearest edge in one go
      for (let i = 0; i < count; i++) {
        if (py[i] < -height * 0.6) py[i] = -30 - seed[i] * 160;
        else if (py[i] > height * 1.6) py[i] = height + 30 + seed[i] * 160;
      }
    }
    if (still) settle();
  }

  /** The page's reading direction, read each time: the language can change */
  function readsRtl() {
    return getComputedStyle(document.documentElement).direction === "rtl";
  }

  /** Pairs birds and points by position so the streams do not cross */
  function sortForShape(next: Shape) {
    const byBird = [...Array(count).keys()].sort((a, b) => px[a] - px[b]);
    const byPoint = [...Array(count).keys()].sort((a, b) => next.xs[a] - next.xs[b]);
    for (let i = 0; i < count; i++) order[byBird[i]] = byPoint[i];
  }

  function settle() {
    if (!active) return;
    for (let i = 0; i < count; i++) {
      const [x, y] = target(i, active);
      px[i] = x;
      py[i] = y;
      vx[i] = 0;
      vy[i] = 0;
      // a still flock still faces many ways, or it reads as a printed pattern
      hx[i] = Math.cos(seed[i] * 2.6 - 1.9);
      hy[i] = Math.sin(seed[i] * 2.6 - 1.9);
    }
  }

  /** Where bird i belongs right now, in screen coordinates */
  function target(i: number, stage: Stage): [number, number] {
    const box = stage.box;
    if (stage.el.dataset.flock === "wave") {
      const u = (i + 0.5) / count;
      const ribbon = i % 3;
      const t = clock * 0.012;
      const talk = 0.22 + 0.78 * Math.abs(Math.sin(u * 3.1 + t * 0.6) * Math.sin(u * 7.3 - t * 0.43));
      const line = Math.sin(u * TAU * (2.4 + ribbon * 0.5) + t * (1.3 + ribbon * 0.3) + ribbon * 2);
      const fade = Math.min(1, Math.min(u, 1 - u) * 9);
      return [
        box.left + u * box.width,
        box.top + box.height / 2 + line * talk * fade * box.height * 0.46 + (seed[i] - 0.5) * 12,
      ];
    }
    if (!shape) return [box.left + seed[i] * box.width, box.top + box.height / 2];
    const at = order[i];
    let x = box.left + shape.xs[at];
    let y = box.top + shape.ys[at];
    if (!still) {
      // a small life of its own, and the wave that runs through the whole flock
      x += Math.sin(clock * 0.05 + seed[i] * 40) * 1.3;
      y += Math.cos(clock * 0.043 + seed[i] * 30) * 1.3;
      if (sweep >= 0) {
        // the wave runs with the reading direction: right to left in Arabic
        const along = sweepRtl ? 1 - sweep : sweep;
        const off = (x - box.left - along * box.width) / (box.width * 0.09);
        y -= Math.exp(-off * off) * box.height * 0.1;
      }
    }
    return [x, y];
  }

  function step(dt: number) {
    clock += dt;
    if (clock - measured > 120) readStages();
    const stage = pickStage();

    // bird colour follows the stage, slowly
    const want = stage?.el.dataset.tone === "voice" ? voice : ink;
    for (let c = 0; c < 3; c++) colour[c] += (want[c] - colour[c]) * 0.04 * dt;

    idle = seen ? 0 : idle + dt;
    if (stage) {
      const words = (stage.el.dataset.words ?? "").split("|").filter(Boolean);
      if (stage.el.dataset.flock === "word") {
        if (words.length > 1 && spoken === null) {
          wordTimer += dt * STEP_MS;
          if (wordTimer > HOLD_MS) {
            wordTimer = 0;
            wordIndex++;
            changeShape(false);
          }
        }
        nextSweep -= dt;
        if (nextSweep <= 0 && sweep < 0) {
          sweep = 0;
          sweepRtl = readsRtl();
        }
        if (sweep >= 0) {
          sweep += 0.0075 * dt;
          if (sweep > 1) {
            sweep = -1;
            nextSweep = 380 + Math.random() * 260;
          }
        }
      }
    }

    for (let i = 0; i < count; i++) {
      if (stage) {
        if (wait[i] > 0) wait[i] -= dt;
        else {
          const [tx, ty] = target(i, stage);
          const ox = tx - px[i];
          const oy = ty - py[i];
          const dist = Math.hypot(ox, oy);
          const pace = Math.min(7 + dist * 0.02, dist * 0.14);
          const wantX = dist > 0.01 ? (ox / dist) * pace : 0;
          const wantY = dist > 0.01 ? (oy / dist) * pace : 0;
          const turn = dist > 60 ? 0.07 : 0.24;
          vx[i] += (wantX - vx[i]) * turn * dt;
          vy[i] += (wantY - vy[i]) * turn * dt;
          if (dist > 50) {
            // streams bend on the way instead of flying straight
            const swirl = Math.sin(py[i] * 0.006 + clock * 0.02) + Math.cos(px[i] * 0.005 - clock * 0.016);
            vx[i] += Math.cos(swirl * 2.4) * 0.34 * dt;
            vy[i] += Math.sin(swirl * 2.4) * 0.34 * dt;
          }
        }
      }

      // a hand or a pointer is the falcon: the birds nearby break away
      const fx = px[i] - falconX;
      const fy = py[i] - falconY;
      const f2 = fx * fx + fy * fy;
      if (f2 < 12100 && f2 > 1) {
        const push = ((12100 - f2) / 12100) * 1.7;
        const f = Math.sqrt(f2);
        vx[i] += (fx / f) * push * dt;
        vy[i] += (fy / f) * push * dt;
      }
      px[i] += vx[i] * dt;
      py[i] += vy[i] * dt;
      const speed = Math.hypot(vx[i], vy[i]);
      if (speed > 0.7) {
        hx[i] += (vx[i] / speed - hx[i]) * 0.14 * dt;
        hy[i] += (vy[i] / speed - hy[i]) * 0.14 * dt;
      }
    }
  }

  const BUCKETS = [0.5, 0.75, 1];
  const birdSize = (stage: Stage) =>
    Math.min(3.2, Math.max(1.5, 0.22 * Math.sqrt((stage.box.width * stage.box.height) / count)));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!active) return;
    // Stages guide the formation, but never clip birds travelling across the page.
    // birds shrink when the flock has a small box to fill
    const wanted = active ? birdSize(active) : 3;
    scale += (wanted - scale) * 0.05;
    ctx.lineWidth = Math.min(1.2, Math.max(0.8, scale * 0.42));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let b = 0; b < BUCKETS.length; b++) {
      ctx.strokeStyle = `rgb(${colour[0] | 0} ${colour[1] | 0} ${colour[2] | 0} / ${BUCKETS[b]})`;
      ctx.beginPath();
      for (let i = b; i < count; i += BUCKETS.length) {
        const x = px[i];
        const y = py[i];
        if (x < -8 || y < -8 || x > width + 8 || y > height + 8) continue;
        const flap = still ? 0.8 : 0.62 + 0.38 * Math.sin(clock * 0.34 + seed[i] * 50);
        const s = scale * (0.72 + seed[i] * 0.56);
        const bx = hx[i] * s;
        const by = hy[i] * s;
        ctx.moveTo(x - bx * 0.7 - by * flap, y - by * 0.7 + bx * flap);
        ctx.lineTo(x + bx * 0.5, y + by * 0.5);
        ctx.lineTo(x - bx * 0.7 + by * flap, y - by * 0.7 - bx * flap);
      }
      ctx.stroke();
    }
  }

  function loop(now: number) {
    frame = 0;
    if (!running) return;
    const dt = Math.min(2.4, (now - last) / STEP_MS || 1);
    last = now;
    step(dt);
    draw();
    // nothing on screen for a while: rest until a stage comes back
    if (idle > 200) {
      running = false;
      ctx.clearRect(0, 0, width, height);
      return;
    }
    frame = requestAnimationFrame(loop);
  }

  function wake() {
    if (still) {
      paintStill();
      return;
    }
    if (running || document.hidden) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  /** Reduced motion: one quiet picture, redrawn only when the page moves */
  function paintStill() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const was = active;
      const stage = pickStage();
      if (!stage) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      if (was?.el === stage.el) settle();
      scale = birdSize(stage);
      for (let c = 0; c < 3; c++)
        colour[c] = (stage.el.dataset.tone === "voice" ? voice : ink)[c];
      draw();
    });
  }

  function refresh() {
    shapes = new Map();
    active = null;
    size();
    readColours();
    colour = [...ink];
    readStages();
    wake();
  }

  const onScroll = () => wake();
  const onResize = () => {
    if (size()) {
      shapes = new Map();
      active = null;
      readStages();
    }
    wake();
  };
  const onVisibility = () => {
    if (document.hidden) running = false;
    else wake();
  };
  const onPointer = (event: PointerEvent) => {
    falconX = event.clientX;
    falconY = event.clientY;
  };
  const onLeave = () => {
    falconX = falconY = -9999;
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("pointerdown", onPointer, { passive: true });
  addEventListener("pointerup", onLeave, { passive: true });
  addEventListener("pointercancel", onLeave, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  refresh();

  return {
    refresh,
    say(text) {
      spoken = text;
      clearTimeout(spokenTimer);
      readStages();
      if (active?.el === stages[0]?.el) changeShape(false);
      if (still) paintStill();
      spokenTimer = window.setTimeout(() => {
        spoken = null;
        if (active?.el === stages[0]?.el) changeShape(false);
        if (still) paintStill();
      }, 9000);
      wake();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      clearTimeout(spokenTimer);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onPointer);
      removeEventListener("pointerdown", onPointer);
      removeEventListener("pointerup", onLeave);
      removeEventListener("pointercancel", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
