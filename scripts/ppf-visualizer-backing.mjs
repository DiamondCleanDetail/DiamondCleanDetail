/**
 * Builds the backing layer that sits behind every PPF visualizer tier.
 *
 * The renders were cut out of their original background, and the cut went
 * straight through the cabin glass: where you should see the far-side rear
 * window and the interior behind it, the PNG is simply transparent. On the
 * old dark page that read as tinted glass and nobody noticed. On white it
 * shows as white holes with a pale fringe around them.
 *
 * Rather than re-cut five renders, this produces one opaque patch shaped to
 * exactly those holes and colour-matched to the paint around each one. Drawn
 * underneath the stack, it is invisible everywhere the car is solid and fills
 * in behind it everywhere the car is not.
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

/** Below this, a pixel is treated as background rather than car. */
const SOLID = 200;
/** How far to grow the patch past the hole edge. The fringe is the partly
 * transparent ring around each hole, so the patch has to reach under it —
 * stopping at the hole leaves exactly the white outline we are hiding. */
const GROW = 3;

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

/** A pixel is "hole" only if every tier agrees it is see-through there. A
 * tier that paints film over a gap must not end up with a patch showing
 * through its own artwork. */
const seeThrough = new Uint8Array(W * H).fill(1);
for (const { data } of layers) {
  for (let i = 0; i < W * H; i++) {
    if (data[i * 4 + 3] >= SOLID) seeThrough[i] = 0;
  }
}

// The background is whatever transparency connects to the edge of the canvas.
// Everything else see-through is enclosed by the car: a hole.
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

let patch = new Uint8Array(W * H);
let holeCount = 0;
for (let i = 0; i < W * H; i++) {
  if (seeThrough[i] && !outside[i]) {
    patch[i] = 1;
    holeCount++;
  }
}

// Grow under the fringe, but never past the car's outer edge — growing into
// `outside` would paint a dark halo along the silhouette against the white.
for (let pass = 0; pass < GROW; pass++) {
  const next = patch.slice();
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (patch[i] || outside[i]) continue;
      if (
        patch[i - 1] ||
        patch[i + 1] ||
        patch[i - W] ||
        patch[i + W]
      ) {
        next[i] = 1;
      }
    }
  }
  patch = next;
}

// Colour each patch pixel from the nearest solid paint, spread inward one
// ring at a time. A flat fill would read as a dark blob behind glass that is
// lit differently top to bottom; borrowing the neighbouring colour keeps the
// patch invisible even where it peeks past the fringe.
const base = layers[layers.length - 1].data;
const rgb = new Uint8Array(W * H * 3);
const known = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) {
  if (!patch[i] && base[i * 4 + 3] >= SOLID) {
    rgb[i * 3] = base[i * 4];
    rgb[i * 3 + 1] = base[i * 4 + 1];
    rgb[i * 3 + 2] = base[i * 4 + 2];
    known[i] = 1;
  }
}

let remaining = holeCount;
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

const patched = patch.reduce((n, v) => n + v, 0);
console.log(
  `${OUT}: ${holeCount} hole px, ${patched} painted after ${GROW}px grow`
);
