# Photo provenance

Which images on the site are the business's own work and which are licensed
stock standing in until real photos exist.

The stock is deliberate, not an oversight. The business is still building a
library of its own current work, and stock beats leaving a visible "photo
coming soon" box, which reads as broken. Everything in the stock table is
meant to be replaced as real jobs get shot — this file is the swap list.

**To replace one:** drop the new photo in at the same path and the same
aspect, delete the old file, and move the row up to the "our own work"
table. Nothing else needs touching. The aspect column matters — every slot
crops with `object-cover`, so a portrait photo in a 4:3 slot loses its top
and bottom.

---

## Our own work

Real jobs. These are the ones that carry the site.

| File | Page | Slot |
| --- | --- | --- |
| `correction-swirls.webp` | Paint Correction | benefit — Removes swirl marks |
| `correction-halfandhalf.webp` | Paint Correction | benefit — The right prep step |
| `work/van-on-site.webp` | Mobile Detailing | benefit — We come to you |
| everything under `/public/work/` | Our Work, all galleries | job photos |
| `/public/video/*.mp4` | service page heroes and process clips | |

These are also the most convincing images on the site — the van shot in
particular does more for the core promise than any stock photo could. That is
not a coincidence, and it is the argument for replacing the rest as soon as
there is something to replace them with.

---

## Stock, awaiting real photos

| File | Page | Slot | Aspect | What would replace it |
| --- | --- | --- | --- | --- |
| `correction-gloss.webp` | Paint Correction | benefit — Maximizes gloss | 4:3 | A finished panel of ours reflecting something hard-edged |
| `scratch-single.webp` | Scratch Removal | what-it-is | 4:3 | One isolated scratch on otherwise clean paint |
| `scratch-spot-repair.webp` | Scratch Removal | benefit — Fast turnaround | 4:3 | Our polisher on one small area, rest of the panel dry |
| `scratch-too-deep.webp` | Scratch Removal | benefit — Honest assessment | 4:3 | A scratch we turned away, through to primer |
| `scratch-removal-hero.webp` | Scratch Removal | hero + card | 3:2 | Any scuffed panel we were called out to |
| `leather-cabin.webp` | Leather Restoration | what-it-is | 4:3 | A leather interior we finished, shot wide |
| `leather-wheel.webp` | Leather Restoration | benefit — Prevents cracking | 4:3 | Conditioner going into a customer's wheel |
| `leather-seat-clean.webp` | Leather Restoration | benefit — Feels like new | 4:3 | Us deep-cleaning a seat |
| `leather-restored-half.webp` | Leather Restoration | benefit — Restores faded color | 4:3 | Our own taped half-restored seat |
| `leather-finished.webp` | Leather Restoration | card | 4:3 | A finished interior of ours |
| `fleet-vans.webp` | Fleet Detailing | what-it-is + benefit | 16:10 | A multi-vehicle job of ours |
| `fleet-lot.webp` | Fleet Detailing | benefit — Volume pricing | 4:3 | Same |
| `fleet-hero.jpg` | Fleet Detailing | hero + card | wide | Same |
| `ceramic-weather.webp` | Ceramic Coating | what it stands up to | 3:2 | Conceptual — fine to keep |
| `ceramic-coated-vs-uncoated.webp` | Ceramic Coating | why it works | 1:1 | Diagram — fine to keep, but it misspells "pollutants" |
| `ceramic-coating-diagram.jpg` | Ceramic Coating | (unused since the page was rebuilt) | 1:1 | — |
| `ppf-what-it-is-stock.webp` | PPF | what-it-is | 1:1 | A car of ours mid-install |
| `ppf-self-healing-placeholder-stock.webp` | PPF | benefit — Self-healing | 4:3 | A heat-gun healing demo on our own film |
| `ppf-resale-placeholder-stock.webp` | PPF | benefit — Resale value | 4:3 | A wrapped car of ours |
| `specialty-vehicles-hero.png` | RV / Boat / Aircraft | hero + card | wide | **The most important one.** That page claims a capability with no evidence behind it. If no such job exists yet, soften the page instead. |

---

## Neither — renders and diagrams

Not photographs, so provenance does not apply.

- `ppf-visualizer-*.png` — the five coverage renders and the backing patch
- `tint-addon-pano-roof.webp` — Tesla roof render
- `/public/tint-levels/*` — the tint shade previews

---

## Low resolution, worth re-sending

These are placed and shipping, but the source files are smaller than their
slots want and go soft on a phone.

| File | Source size | Slot wants |
| --- | --- | --- |
| `correction-halfandhalf.webp` | 447 px wide | ~800 px |
| `scratch-too-deep.webp` | 1024 px wide | ~1400 px |

---

*Kept by hand. If you add an image to a service page, add a row.*
