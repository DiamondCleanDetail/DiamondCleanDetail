import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { previewAspect, tintLevels } from "./tintLevels.ts";

/** Width and height straight out of a PNG's IHDR chunk, which always sits at
 * a fixed offset — enough to check a render's shape without an image library. */
function pngSize(publicPath: string) {
  const buf = readFileSync(join(process.cwd(), "public", publicPath));
  assert.equal(buf.readUInt32BE(0), 0x89504e47, `${publicPath} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const sizes = ["sedan", "suv", "truck"] as const;

test("the declared preview aspect matches the renders on disk", () => {
  for (const size of sizes) {
    for (const level of tintLevels) {
      const path = level.images[size];
      if (!path) continue;
      const { width, height } = pngSize(path);
      assert.equal(
        (width / height).toFixed(3),
        previewAspect[size].toFixed(3),
        `${path} is ${width}x${height}, which does not match previewAspect.${size} — ` +
          `update previewAspect when swapping render sets, or the visualiser will letterbox`
      );
    }
  }
});

test("every shade in a bucket is the same size, so switching cannot shift the car", () => {
  for (const size of sizes) {
    const seen = tintLevels
      .map((l) => l.images[size])
      .filter((p): p is string => Boolean(p))
      .map((p) => {
        const { width, height } = pngSize(p);
        return `${width}x${height}`;
      });
    assert.equal(new Set(seen).size, seen.length ? 1 : 0, `${size} renders differ in size: ${seen.join(", ")}`);
  }
});
