# Azul editorial image set

The original editorial scenes were generated for the September 2026 composition pass with Higgsfield's Recraft V4.1 model. The current Home scene is a Higgsfield image supplied by Saymon (revision 3). Source assets stay in this directory; Astro creates responsive WebP variants during the build.

| Asset                        | Page role                                          | Higgsfield job                      |
| ---------------------------- | -------------------------------------------------- | ----------------------------------- |
| `storefront-visibility.png`  | Home visibility problem and local-business context | `9c6b…`                             |
| `systems-content-studio.png` | Soft Services hero backdrop                        | `2ad8…`                             |
| `founder-intersection.png`   | Soft About hero backdrop of media plus code        | `410a…`                             |
| `web-development.png`        | How We Work hero and website service detail        | `39fa…`                             |
| `local-discovery.png`        | Google Business and local discovery detail         | `4ca8…`                             |
| `meta-business.png`          | Meta presence detail                               | `9b09…`                             |
| `social-content.png`         | Social-content workflow detail                     | `df36…`                             |
| `project-handoff.png`        | Privacy hero and project-handoff detail            | `a7fa…`                             |
| `hero-cinematic/`            | Current Home hero scene and focused mobile crop    | Higgsfield, supplied 2026-09-30     |
| `hero-cube.png`              | Unused since 2026-10-01; former loader and hero    | OpenAI image generation, 2026-09-23 |
| `hero-shadow-stage.png`      | Retained former Home shadow plate; no current use  | OpenAI image generation, 2026-09-23 |

## Founder photography

`saymon-rivas-founder.png` is a real, user-supplied portrait of Saymon holding the Azul website. It appears as compact founder proof on Home and as the primary founder image on About. Unlike the generated studies above, it may be presented as Saymon and as evidence of the current site build.

## Art direction and truth boundary

The set uses cinematic editorial photography, practical work surfaces, Central Florida light, deep blue and slate environments, cloud-gray highlights, and restrained coral signals. Prompts excluded logos, readable performance claims, famous interfaces, identifiable clients, and founder likenesses.

The generated images are conceptual illustrations. They must never be presented as client work, client premises, measured results, or a portrait of Saymon. Replace them with verified founder or client photography later when real evidence adds more value.

The current Home hero is a generated photograph of a clean 3×3×3 stack of satin black/deep-navy blocks on a polished stone counter, a light beam across a dark navy wall, a laptop corner, and a window with ocean and palm trees. It replaces the separate cutout and shadow plate. Crop and responsive export details are in [`hero-cinematic/README.md`](hero-cinematic/README.md).

The former Home cube was generated as a transparent cutout: a dark-navy 3×3 faceted puzzle cube, satin-ceramic and anodized-metal surfaces, subtle electric-blue edge reflections, one tiny coral glint, no logo or text. `SiteLoader` used it until 2026-10-01, when the logo replaced it; the file is kept but no longer referenced. Its generation prompt is preserved in `hero-cube.prompt.md`.

The former shadow stage is a separate, text-free deep-blue studio environment with diagonal penumbral shadows and grazing light. It is retained in source but is no longer used on Home. Its generation prompt is preserved in `hero-shadow-stage.prompt.md`.
