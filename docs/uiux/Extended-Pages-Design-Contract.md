# VAS Extended Pages — Design Contract

## Goal
Expand RedesignVAS with new, non-duplicate page roles while preserving the existing VAS visual system.

## Source-of-truth
- Existing RedesignVAS tokens/components and shared header/footer.
- Official VAS public content for scholarships, alumni, career guidance, recruitment, contact/campus facts.
- `skills_UIUX`: project truth first, route/page-role classification, ADOPT/ADAPT/REJECT, rendered QA.
- `uiux-ai-workspace`: understand → plan → execute → verify; reuse existing abstractions; avoid duplicate systems.

## Immutable visual language
- Fraunces for display headings.
- Plus Jakarta Sans for UI/body.
- VAS Red `#B51F1F`, deep red `#8A1414`, Gold `#C69A4C`, Gold Soft `#E3C98E`, Warm Ink `#2A1A17`.
- Shared max-width/grid, pill CTAs, soft 12/20/24px radii, 1px neutral borders.
- Existing shared header/footer and Figma-compatible motion system.

## Page-role matrix
| Route | Role | Primary user question | Unique composition |
|---|---|---|---|
| `/hoc-bong/` | Scholarship hub | What is recognized and how? | Dual scholarship matrix + criteria table + nomination timeline |
| `/cuu-hoc-sinh/` | Alumni network | Where do VASers go after school? | Editorial profile + global constellation + story notes |
| `/tu-van-huong-nghiep/` | Decision support | How do I choose a future path? | Four-stage roadmap + interactive direction picker |
| `/tuyen-dung/` | Careers | Why work at VAS and what is open? | Employer-value mosaic + filterable job board |
| `/ho-tro-hoc-sinh/` | Wellbeing/support | How does support work when a student needs help? | Support ecosystem + help path + family partnership |
| `/lien-he/` | Contact router | Who should I contact for my need? | Intent router + campus directory |
| `/dat-lich-tham-quan/` | Conversion scheduler | How can my family visit? | 3-step planner + live request summary |
| `/co-so-riverside/` | Campus detail | What does one specific campus feel like? | Immersive campus hero + facility gallery + day timeline |

## Anti-duplication rule
Shared brand components may repeat, but no two pages may share the same macro composition or primary interaction model. A page is rejected if its first two content sections, primary decision model, and CTA flow can be swapped with another route without changing meaning.

## Responsive contract
Responsive all: 1440 desktop, ~768 tablet, ~375 mobile. Composition may stack/reorder but must preserve primary intent and CTA.

## Figma capture
All pages load the existing `assets/motion-system.js`, which detects headless capture and forces reveal/lazy media into a capture-safe visible state.

## QA gates
- semantic headings and usable links/buttons
- no invented time slots or fake availability
- no hidden content below fold in headless/Figma capture
- shared design tokens only; no parallel brand palette
- no macro layout duplication across the eight new routes
