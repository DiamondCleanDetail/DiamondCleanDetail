import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SWIPE_DISTANCE_PX,
  SWIPE_VELOCITY_PX_PER_S,
  swipeDirection,
} from "./swipe.ts";

test("a short, slow drag is a nudge and stays put", () => {
  assert.equal(swipeDirection(0, 0), 0);
  assert.equal(swipeDirection(-10, -50), 0);
  assert.equal(swipeDirection(SWIPE_DISTANCE_PX, SWIPE_VELOCITY_PX_PER_S), 0, "exactly at both thresholds");
});

test("dragging far enough pages, in the direction of travel", () => {
  assert.equal(swipeDirection(-(SWIPE_DISTANCE_PX + 1), 0), 1, "dragged left -> next");
  assert.equal(swipeDirection(SWIPE_DISTANCE_PX + 1, 0), -1, "dragged right -> previous");
});

test("a quick flick pages even when the finger barely moved", () => {
  assert.equal(swipeDirection(-8, -(SWIPE_VELOCITY_PX_PER_S + 1)), 1);
  assert.equal(swipeDirection(8, SWIPE_VELOCITY_PX_PER_S + 1), -1);
});

test("on a flick the direction comes from the velocity, not the offset", () => {
  // Finger drifted a few pixels one way but was thrown the other.
  assert.equal(swipeDirection(5, -900), 1);
  assert.equal(swipeDirection(-5, 900), -1);
});

test("on a long drag the direction comes from the offset", () => {
  // Slowing to a stop at the end of a long pull still pages that way.
  assert.equal(swipeDirection(-200, 30), 1);
  assert.equal(swipeDirection(200, -30), -1);
});
