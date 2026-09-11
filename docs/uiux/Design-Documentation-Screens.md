# RedesignVAS — Design Documentation Screens

## Scope
Five public HTML screens document the existing VAS visual and experience system without introducing a second brand system:

- `/design-system/`
- `/component-states/`
- `/sitemap/`
- `/user-flow/`
- `/prototype/`

## Source of truth
- Production tokens/components in `assets/base.css`, `styles.css`, `assets/shared.js`, and `assets/motion-system.*`.
- React/Figma source tokens in `src/index.css` and current component patterns in `src/App.tsx`.
- Current public route inventory on `main`.
- Existing `docs/uiux/Extended-Pages-Design-Contract.md` anti-duplication and responsive rules.

## Domain adaptation
The user's e-commerce examples are treated as structural examples, not fabricated VAS functionality.

- `Product card` is documented as the reusable Programme / Campus / Scholarship content-card anatomy.
- `Browse → Detail → Cart → Checkout → Success` becomes the real education conversion path `Explore → Programme/Campus detail → Decision support → Admissions/Visit request → next-step confirmation`.
- Wishlist/account/cart are not invented because they do not exist in project truth.

## Visual contract
- Fraunces display + Plus Jakarta Sans UI/body.
- VAS Red `#B51F1F`, Footer Red `#8A1414`, Gold `#C69A4C`, Gold Soft `#E3C98E`, Warm Ink `#2A1A17`, Line `#E3E3E3`.
- 1440px max-width; 20px mobile and 40px desktop gutters.
- 12/16/20/24px card radii + pill controls.
- Shared site header/footer remain the real production components through `assets/shared.js`.
- Motion uses the existing capture-safe motion system and respects `prefers-reduced-motion`.

## Screen-role separation
Each screen has a different macro composition:

| Screen | Composition |
|---|---|
| Design System | specimen catalogue / token inventory |
| Component States | state matrix / comparison board |
| Sitemap | route tree / IA map |
| User Flow | horizontal journey lanes |
| Prototype | embedded live browser + entry-point cards |

## Acceptance criteria
- All requested Design System categories are visible, including controls, cards, site shell, radius/border/motion.
- State screen explicitly covers Default, Hover, Active, Focus, Disabled, Error, Success, Selected, Saved.
- Sitemap reflects real VAS routes rather than fictional commerce pages.
- User Flow includes at least four meaningful end-to-end journeys and a direct Detail → Contact / Consultation path.
- Prototype screen includes live prototype preview, main flows, entry points, and CTA to actual website routes.
- Screens are responsive at desktop/tablet/mobile and retain the existing brand tokens.
