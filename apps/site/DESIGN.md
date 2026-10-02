---
name: Azul Online Projects
description: An editorial working map where dependable systems and creative content build one clear online identity.
colors:
  deep-azul: '#071A2B'
  azul-ink: '#0B2238'
  night-stage: '#04131F'
  slate-current: '#334A5F'
  cloud-gray: '#EDF2F5'
  cloud-white: '#F8FBFC'
  coral-signal: '#FF6F61'
  coral-active: '#FF887D'
  azul-electric: '#54A7D8'
  azul-mist: '#A8C8D9'
typography:
  display:
    fontFamily: 'Epilogue Variable, Epilogue, sans-serif'
    fontSize: 'clamp(5.6rem, 9.2vw, 9rem)'
    fontWeight: 650
    lineHeight: 0.86
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Epilogue Variable, Epilogue, sans-serif'
    fontSize: 'clamp(2.65rem, 5.8vw, 5.25rem)'
    fontWeight: 610
    lineHeight: 0.98
    letterSpacing: '-0.035em'
  section-title:
    fontFamily: 'Epilogue Variable, Epilogue, sans-serif'
    fontSize: 'clamp(2rem, 3.8vw, 3.65rem)'
    fontWeight: 610
    lineHeight: 1.04
    letterSpacing: '-0.03em'
  title:
    fontFamily: 'Epilogue Variable, Epilogue, sans-serif'
    fontSize: 'clamp(1.25rem, 2vw, 1.65rem)'
    fontWeight: 610
    lineHeight: 1.2
  body:
    fontFamily: 'Manrope Variable, Manrope, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.65
  body-large:
    fontFamily: 'Manrope Variable, Manrope, sans-serif'
    fontSize: 'clamp(1.1rem, 1.7vw, 1.35rem)'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: 'Manrope Variable, Manrope, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: '0.07em'
rounded:
  control: '2px'
  chapter: 'clamp(1.75rem, 4.5vw, 4.5rem)'
  offer: 'clamp(1.5rem, 3vw, 3rem)'
  signal: '50%'
spacing:
  compact: '0.75rem'
  standard: '1rem'
  generous: '2rem'
  roomy: '3rem'
  section: 'clamp(6rem, 10vw, 10rem)'
components:
  button-primary:
    backgroundColor: '{colors.coral-signal}'
    textColor: '{colors.deep-azul}'
    rounded: '{rounded.control}'
    padding: '0.9rem 1.15rem'
    height: '50px'
  button-primary-hover:
    backgroundColor: '{colors.cloud-white}'
    textColor: '{colors.deep-azul}'
    rounded: '{rounded.control}'
  button-text:
    textColor: '{colors.cloud-gray}'
    height: '44px'
  navigation:
    backgroundColor: '{colors.deep-azul}'
    textColor: '{colors.azul-mist}'
  input:
    backgroundColor: '{colors.cloud-white}'
    textColor: '{colors.deep-azul}'
    rounded: '{rounded.control}'
    padding: '0.8rem 0.9rem'
  chapter-dark:
    backgroundColor: '{colors.deep-azul}'
    textColor: '{colors.cloud-gray}'
    rounded: '{rounded.chapter}'
  chapter-light:
    backgroundColor: '{colors.cloud-gray}'
    textColor: '{colors.deep-azul}'
    rounded: '{rounded.chapter}'
  offer-light:
    backgroundColor: '{colors.cloud-white}'
    textColor: '{colors.deep-azul}'
    rounded: '{rounded.offer}'
  signal-mark:
    textColor: '{colors.azul-electric}'
    width: '3rem'
---

# Design System: Azul Online Projects

## Overview

**Creative North Star: "Signal Relay / Working Map"**

Azul looks like a founder can trace a small-business problem, connect the right technical and creative work, and carry it through launch. The site is premium and cinematic in pacing, but its map is useful rather than theatrical or disguised as software.

Deep-blue fields establish focus; light planes make explanations effortless to read. Oversized statements, operational labels, real photography, and a few diagrammatic routes make the systems-plus-media practice recognizable without turning every section into a feature grid.

**Key Characteristics:**

- Alternating opaque Azul and Cloud Gray chapters with visibly varied side insets.
- Oversized Epilogue statements supported by measured Manrope explanations.
- Coral for decisions and live points; electric blue for lines and focus.
- Square actions and fields inside generously rounded narrative planes.
- Room for section-specific changes in scale, density, alignment, and diagram treatment.
- A static cinematic Home scene: a smooth satin black/deep-blue block stack, broad right-hand window reflections, and a polished navy tabletop, with a dark left field for live text.

## Colors

The palette moves between a deep blue working atmosphere and a cool, nearly white reading surface.

### Primary

- **Deep Azul** (`#071A2B`): the brand field and dark chapter ground.
- **Coral Signal** (`#FF6F61`): primary action, selected state, or a single active node. **Coral Active** (`#FF887D`) is a nearby state tone, not a second brand accent.

### Secondary

- **Slate Current** (`#334A5F`): structural mid-tone and secondary copy.
- **Azul Electric** (`#54A7D8`): route lines, focus, and connection states.
- **Azul Mist** (`#A8C8D9`): supporting text on dark fields.

### Neutral

- **Night Stage** (`#04131F`) and **Azul Ink** (`#0B2238`): deeper chapter and offer surfaces.
- **Cloud Gray** (`#EDF2F5`) and **Cloud White** (`#F8FBFC`): reading planes, cards, and contrast.

**The Live Signal Rule.** Coral marks a meaningful next action or one live point; it loses its meaning when used as ambient decoration.

## Typography

**Display Font:** Epilogue Variable, with Epilogue and sans-serif fallbacks. **Body/Label Font:** Manrope Variable, with Manrope and sans-serif fallbacks.

### Hierarchy

- **Display** (650, `clamp(5.6rem, 9.2vw, 9rem)`, 0.86): Home's dominant first-view statement.
- **Headline** (610, `clamp(2.65rem, 5.8vw, 5.25rem)`, 0.98): major chapter and conversion turns.
- **Section title** (610, `clamp(2rem, 3.8vw, 3.65rem)`, 1.04): a stronger option for process stages, offers, and other consequential headings.
- **Title** (610, `clamp(1.25rem, 2vw, 1.65rem)`, 1.2): compact headings when the composition is already carrying the emphasis.
- **Body / body large** (400, `1rem` / `clamp(1.1rem, 1.7vw, 1.35rem)`): plain-language explanation, usually within 70ch; use the larger role when the copy needs to be read as part of the visual story.
- **Label** (700, `0.75rem`, 0.07em tracking): quiet metadata only. A step number, phase name, or outcome may be treated as a display element instead.

**The Statement First Rule.** One decisive heading owns a section; supporting text clarifies it instead of competing at display scale.

**The Scale Is a Starting Point Rule.** These are current reusable roles, not ceilings for every section. Live explorations may change scale, weight, wrapping, and hierarchy—including much larger step titles—while retaining Epilogue and Manrope and clear reading order.

## Layout

Use a fluid frame capped at `94rem`, `clamp(1rem, 4vw, 4.5rem)` page gutters, and `clamp(6rem, 10vw, 10rem)` major-section spacing. These are site anchors, not prescribed internal gaps. Full-width atmosphere and chapter edges can extend past the interior reading measure. Explore asymmetric columns, open editorial layouts, larger stage panels, imagery, or diagrams according to the content; a ruled ledger is only one option.

At a major color change, an overlapping chapter plane takes the foreground. Alternate broad, medium, and narrow side insets so adjacent planes do not share one vertical edge. Light chapters close with rounded lower corners; selected dark chapters do so when that makes their foreground position clear. Same-tone transitions can remain flat. A shallow accent lip appears only at selected opening transitions; the Home hero remains an uninterrupted full-width field.

On small screens, preserve the chapter rhythm at reduced insets, stack diagrams in reading order, keep navigation discoverable, and allow actions to grow to useful touch widths.

Home's scene fills the hero above `58rem`, with a directional overlay protecting the headline and information card while the right-hand window stays luminous. At `58rem` and below, a focused crop spans the page between the headline and card, with soft top and bottom fades into Night Stage. Keep this composition specific to Home.

Within a chapter, Live variants may change spacing, grouping, alignment, proportion, and density substantially. A process can read as a sequence without four equal columns, a header-to-footer line, or a border between every step.

## Elevation & Depth

Depth comes primarily from opaque tonal overlap, varied chapter widths, and rounded foreground edges—not a shadow on every card. Chapter shadows are soft and low-contrast; the `0 18px 55px rgba(2, 12, 22, 0.24)` depth shadow protects occasional dark surfaces. Keyboard focus uses a `0 0 0 4px rgba(84, 167, 216, 0.32)` electric-blue halo.

**The Routed, Not Floating Rule.** Elements belong to a shared narrative field; elevation should clarify which chapter or control is in front, not make every block hover.

## Shapes

The site contrasts large chapter corners (`clamp(1.75rem, 4.5vw, 4.5rem)`) with square or nearly square buttons and fields (`2px`). Offer cards may use their own `clamp(1.5rem, 3vw, 3rem)` radius. Rules, paths, and the simple two-current/one-node signal mark are available motifs, not mandatory borders. A section may replace hairlines with space, tonal shifts, larger numerals, or a more substantial connector. Never round every nested item simply because its parent is rounded.

## Components

### Buttons and links

Primary consultation actions are coral rectangular switches, at least 50px high, with an internal arrow cell. Hover moves the arrow and changes the whole control to Cloud White without shifting its hit target. Text links keep a ruled baseline and send the arrow forward. Focus remains visibly electric blue.

### Navigation and fields

The four public routes use quiet Manrope labels and a thin coral active line. At narrow widths, navigation reflows rather than hiding the core routes. Form labels remain explicit; inputs and native selects use rectangular Cloud White surfaces, slate borders, and an electric focus ring. Select-state pulses stay short and interruptible.

### Chapters, offers, and working maps

Full-width chapter planes carry narrative changes; they are not interchangeable with ordinary cards. Home now keeps its first viewport spare and sends visitors to the fuller offer choices below. The larger Online Foundation and Ongoing Visibility offer cards use large type, purposeful contrast, and clear pricing and boundaries. Systems and content converge in the later Home chapter. The current four-column process route is one treatment of Consultation, Direction, Implementation, and Launch—not a prescribed grid, line weight, or type size. Variants may amplify individual stages or change their arrangement while preserving the sequence and meaning. Diagrams must explain actual relationships.

### Signature visual and imagery

The Home hero uses one generated tabletop photograph: a grounded stack of smooth satin black/deep-blue blocks with a clear 3×3 front and subtle rear/top offsets, broad silver-blue reflections from the right, blurred foliage and sky outside the window, a polished navy tabletop, and a cropped laptop corner. Desktop and mobile use the same scene with distinct crops. The picture is decorative, static, and hidden from assistive technology; the headline, information card, and actions remain live content. Its optimized WebP assets and exact generation prompts live in `src/assets/images/azul/hero-cinematic/`.

The former separate cube and studio shadow plate are no longer Home imagery; the site loader now shows the stacked logo instead of the cube cutout. The thin-line Signal Field and procedural fog remain inactive. Services, How We Work, About, and Privacy each use a distinct subdued hero photograph. The real founder portrait appears inside a rounded Cloud Gray card on Home and About, with a distinct crop for each.

## Do's and Don'ts

### Do:

- **Do** use full-width changes and visibly stepped widths to clarify narrative hierarchy.
- **Do** try bolder step typography, larger explanatory copy, different pacing, and line-free groupings when they make a section more legible or memorable.
- **Do** let one large statement, one useful diagram, or one editorial image carry a section.
- **Do** keep Coral Signal rare enough to mean action or live status.
- **Do** preserve readable content and natural scrolling without depending on the decorative scene or animation.
- **Do** treat conceptual images as illustrative and the real portrait as actual founder evidence.

### Don't:

- **Don't** copy Mahhou's or Wispr Flow's words, fonts, graphics, or exact compositions.
- **Don't** turn every content block into a rounded card or repeat tiny accent lips at every transition.
- **Don't** treat the current process grid, fine dividers, or compact labels as required Azul motifs.
- **Don't** re-enable the page-wide fog, add repeated entrance reveals, or hijack scrolling without a new decision.
- **Don't** use pill controls, hard block shadows, emoji interface icons, or decorative monospace.
- **Don't** imply generated scenes show real clients, completed work, results, or Saymon's likeness.
