/**
 * Builds the backing layer that sits behind every PPF visualizer tier.
 *
 * The renders were cut out of their original background and the cut went
 * through the glass. Around the rear side windows that left thin ribbons of
 * missing and half-missing pixels, which on the old dark page read as tint
 * and on white read as bright outlines around the interior shapes.
 *
 * Rather than re-cut five renders, this paints one opaque patch that sits
 * under the whole stack across the rear cabin only. Where the car is solid
 * the patch is hidden; where the cut ate into it, the patch shows through
 * instead of the page.
 *
 * NOT the windshield. That hole is real and deliberate — you look through a
 * windshield to whatever is behind the car, so filling it made the front
 * glass look muddy and tinted. Only the rear glass, where you are looking at
 * the far-side window and the interior behind it, wants something behind it.
 *
 * Run: node scripts/ppf-visualizer-backing.mjs
 */
import sharp from "sharp";

const LAYERS = [
  "barrier",
  "shield",
  "armor",
  "track",
  "full-protection",
].map((s) => `public/services/ppf-visualizer-${s}.png`);

const OUT = "public/services/ppf-visualizer-backing.png";

/** At or above this alpha a pixel is solid car, and hides the patch. */
const SOLID = 250;

/**
 * The rear cabin, in image pixels. The car faces left, so this starts behind
 * the windshield and runs to the back of the rear quarter glass.
 *
 * The box only has to be roughly right: it is intersected with the car's own
 * silhouette below, so its edges can sit over paint or over background
 * without either showing.
 */
const REGION = { x0: 715, x1: 1180, y0: 40, y1: 320 };

const meta = await sharp(LAYERS[0]).metadata();
const W = meta.width;
const H = meta.height;

const layers = await Promise.all(
  LAYERS.map((f) =>
    sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  )
);
for (const { info } of layers) {
  if (info.width !== W || info.height !== H) {
    throw new Error("Layers differ in size — they must share one backing.");
  }
}

/** See-through in EVERY tier. A tier that paints film over a gap must not end
 * up with the patch showing through its own artwork. */
const seeThrough = new Uint8Array(W * H).fill(1);
for (const { data } of layers) {
  for (let i = 0; i < W * H; i++) {
    if (data[i * 4 + 3] >= SOLID) seeThrough[i] = 0;
  }
}

// The page background is whatever transparency reaches the edge of the
// canvas. Everything else is car — either solid, or a gap the cut left
// inside it. Excluding `outside` is what keeps the patch from spilling past
// the silhouette and drawing a dark halo around the roofline.
const outside = new Uint8Array(W * H);
const stack = [];
const flood = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = y * W + x;
  if (outside[i] || !seeThrough[i]) return;
  outside[i] = 1;
  stack.push(i);
};
for (let x = 0; x < W; x++) {
  flood(x, 0);
  flood(x, H - 1);
}
for (let y = 0; y < H; y++) {
  flood(0, y);
  flood(W - 1, y);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  flood(x + 1, y);
  flood(x - 1, y);
  flood(x, y + 1);
  flood(x, y - 1);
}

// The patch: the rear cabin, minus the background. Deliberately includes the
// solid paint in between — those pixels are covered by the car itself, and
// including them means the patch has no internal edges to catch the light.
const patch = new Uint8Array(W * H);
let patchCount = 0;
for (let y = REGION.y0; y <= REGION.y1; y++) {
  for (let x = REGION.x0; x <= REGION.x1; x++) {
    const i = y * W + x;
    if (outside[i]) continue;
    patch[i] = 1;
    patchCount++;
  }
}

// Colour: the car's own pixels where it has them, and where it doesn't,
// neighbouring colour spread inward one ring at a time. A flat fill would
// read as a dark blob behind glass that is lit differently top to bottom.
const base = layers[layers.length - 1].data;
const rgb = new Uint8Array(W * H * 3);
const known = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) {
  if (base[i * 4 + 3] >= SOLID) {
    rgb[i * 3] = base[i * 4];
    rgb[i * 3 + 1] = base[i * 4 + 1];
    rgb[i * 3 + 2] = base[i * 4 + 2];
    known[i] = 1;
  }
}

let remaining = 0;
for (let i = 0; i < W * H; i++) if (patch[i] && !known[i]) remaining++;
const toFill = remaining;

for (let pass = 0; pass < 400 && remaining > 0; pass++) {
  const added = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (known[i] || !patch[i]) continue;
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (const j of [i - 1, i + 1, i - W, i + W]) {
        if (known[j]) {
          r += rgb[j * 3];
          g += rgb[j * 3 + 1];
          b += rgb[j * 3 + 2];
          n++;
        }
      }
      if (n) added.push([i, r / n, g / n, b / n]);
    }
  }
  if (!added.length) break;
  for (const [i, r, g, b] of added) {
    rgb[i * 3] = r;
    rgb[i * 3 + 1] = g;
    rgb[i * 3 + 2] = b;
    known[i] = 1;
    remaining--;
  }
}

const out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  out[i * 4] = rgb[i * 3];
  out[i * 4 + 1] = rgb[i * 3 + 1];
  out[i * 4 + 2] = rgb[i * 3 + 2];
  out[i * 4 + 3] = patch[i] ? 255 : 0;
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(
  `${OUT}: ${patchCount}px patch over the rear cabin, ${toFill}px of it painted in`
);
