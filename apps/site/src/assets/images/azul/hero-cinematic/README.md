# Home cinematic hero

Revision 3 (September 30, 2026) uses a Higgsfield-generated image that Saymon supplied directly: a clean 3×3×3 stack of satin black/deep-navy blocks on a polished stone counter, a light beam across a dark navy wall, a laptop corner in the lower left, and a far-right window with ocean and palm trees. It contains no text, interface, or logos. This is a conceptual illustration, not client work or real premises. The generation prompt was not supplied with the image.

The original 3840×2160 PNG is kept at `.impeccable/hero-cinematic/revision-3-user-supplied.png` at the repository root (git-ignored). Revision 2 (`revision-2-variation-2.png` and `revision-2-prompt.txt` in the same folder) is superseded.

| Shipping source | Dimensions | Size         | Derivation                                                                                 |
| --------------- | ---------- | ------------ | ------------------------------------------------------------------------------------------ |
| `desktop.webp`  | 2560×1440  | 94,366 bytes | Resize of the complete 3840×2160 source (WebP quality 86).                                 |
| `mobile.webp`   | 960×600    | 30,188 bytes | Crop `left: 1450`, `top: 425`, `width: 2240`, `height: 1400` from the source, then resize. |

`desktop.webp.json` and `mobile.webp.json` record this provenance. Both exports derive from the same image; the mobile image is a crop, not a separate generation.

Astro emits desktop WebP widths of 1280, 1920, and 2560, plus mobile widths of 480 and 960. Above `58rem`, the scene covers the full hero behind a left-to-right readability overlay; `object-position` is `40% 70%` above `76rem` and `22% 70%` from `58rem` to `76rem`, so the cube stays to the right of the headline card. At `58rem` and below, the mobile crop appears after the live headline and before the information card, with soft top and bottom fades. The decorative picture has empty alt text and is hidden from assistive technology; it needs no JavaScript or motion.
