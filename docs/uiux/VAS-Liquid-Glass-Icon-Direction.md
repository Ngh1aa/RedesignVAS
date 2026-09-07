# VAS Liquid Glass Icon Direction

Date: 2026-09-07

## Phase classification

- Scope: `system`
- Type: `research + build`
- Risk: `low`
- Mode: `interactive_prototype`
- Phase result: `PASSED`

## Skill Activation Plan

| Task | Trigger/risk | Skill | Expected impact | Verification |
|---|---|---|---|---|
| Define a VAS-specific icon family | Icon style must match brand rather than generic iOS blue glass | `asset-media-and-art-direction` | One consistent family, clear purpose, SVG delivery | Inspect generated family and usage contract |
| Make the family reusable in code | Avoid scattered one-off SVG styling | `design-system-and-components` | Shared palette/material/icon contract | Verify one shared sprite and fixed semantic palette |

## Skills USED

| Skill | Trigger | Applied requirement | Change created | Verification | Evidence |
|---|---|---|---|---|---|
| `asset-media-and-art-direction` | New website icon asset system | One icon family; consistent optical treatment; clean SVG; accessibility guidance | Created a single 24-icon Liquid Glass family tuned to VAS | Visual inspection on light surface and VAS-red surface | Generated preview + sprite |
| `design-system-and-components` | Icons need reusable tokenized treatment | Brand → primitive values → component/icon contract; avoid page-level hardcoding | Locked VAS red/gold/glass values and shared sprite | Sprite uses one defs system for all symbols | `assets/icons/vas-liquid-glass/vas-liquid-glass-sprite.svg` |

## Project truth used

FACT — `src/index.css` defines the active VAS palette as:

- VAS Red: `#B51F1F`
- Gold: `#C69A4C`
- Gold Soft: `#E3C98E`
- Ink: `#2A1A17`
- White paper surfaces

FACT — Current page compositions include both white surfaces and strong VAS-red sections, so the icon treatment needs to remain legible over both.

## External references

| Reference | Label | Use |
|---|---|---|
| Apple Icon Composer / Apple HIG | PRODUCTION | Material principles: layered depth, refraction, translucency, specular highlight |
| Icons8 `liquid-glass-icons` | PRODUCTION | Large React/SVG catalog and recolorable glass treatment; fallback when the custom 24-icon semantic set is insufficient |

Decision: ADAPT the material principles; do not clone Apple app icons or use saturated iOS-blue tint. The VAS version uses clear/white glass, VAS red core strokes and restrained gold refraction.

## Asset contract

- Family: `VAS Liquid Glass`
- Surface: clear/white translucent glass lens
- Core glyph: red gradient `#7F1118 → #B51F1F`
- Refraction accent: `#C69A4C / #E3C98E`
- Base grid: `64 × 64`
- Recommended display size: `32–64px`
- Below `20px`: use simpler non-glass action icon treatment if detail becomes noisy
- Decorative icon: `aria-hidden` or empty alt at the consuming control
- Meaningful standalone icon: provide an accessible text label/name
- Do not mix this family with unrelated 3D, filled-color or flat-outline families in the same composition

## Included symbols

`school`, `book-open`, `graduation-cap`, `globe`, `microscope`, `flask`, `palette`, `music`, `trophy`, `sports-ball`, `laptop`, `lightbulb`, `community`, `heart`, `location`, `calendar`, `phone`, `mail`, `chat`, `compass`, `bus`, `shield-check`, `sparkles`, `arrow-right`.

## System reality

`STATIC` — These are visual assets only. An icon displayed on a CTA/card does not prove navigation, form, API, booking, phone or admissions behavior is real.

## Requirement Coverage Ledger

| ID | Requirement | Status | Verification/evidence |
|---|---|---|---|
| R-ICON-01 | Search for current Liquid Glass icon options | DONE_VERIFIED | Apple official material guidance + Icons8 Liquid Glass library reviewed |
| R-ICON-02 | Fit the actual VAS brand guideline | DONE_VERIFIED | Palette taken from current `src/index.css`; custom red/gold material applied |
| R-ICON-03 | Provide a downloadable usable set | DONE_VERIFIED | 24 individual SVGs + React helper + CSS + preview + ZIP generated |
| R-ICON-04 | Provide a code-link option | DONE_VERIFIED | Shared sprite committed at `assets/icons/vas-liquid-glass/vas-liquid-glass-sprite.svg` |
| R-ICON-05 | Keep icon family consistent | DONE_VERIFIED | One shared defs/material system and 64×64 optical grid |
| R-ICON-06 | Visual QA | DONE_VERIFIED | Generated preview opened and inspected; representative icon also inspected on VAS-red surface |

No BLOCKED requirements in this phase.
