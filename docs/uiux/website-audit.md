# VAS Evidence-driven Redesign Audit — V2

**Date:** 2026-09-19  
**Status:** IMPLEMENTATION AUDIT + DESIGN HYPOTHESES. This is not user research and contains no measured conversion or usability outcome.

## 1. Evidence boundary

- **VERIFIED:** observations directly visible in the current RedesignVAS source or current public VAS pages.
- **INFERRED:** a design implication derived from those observations.
- **ASSUMED:** a hypothesis that still requires user or stakeholder validation.
- No analytics, parent interviews, task-success data or conversion funnel data were supplied.

Public baseline checked:
- https://www.vas.edu.vn/chuong-trinh-dang-ky-tu-van-tuyen-sinh
- https://www.vas.edu.vn/quy-trinh-tuyen-sinh

The public admissions material currently exposes programme information, campus selection and consultation/admission actions. The admissions process is described as registration, entrance assessment and completing enrolment. These are content/IA observations only, not evidence that users find the journey easy or difficult.

## 2. Owner goal ↔ parent goal

| Owner wants to communicate | Prospective parent wants to know/do | Intersection | Website responsibility | CTA timing |
| --- | --- | --- | --- | --- |
| Academic quality and Cambridge pathways | Which learning path fits my child? | Programme confidence | Compare CEP/CAP/CAPI with understandable decision criteria | Before enquiry |
| Six-campus network | Which campus fits our family? | Location + programme fit | Filter campuses by level, programme, area and priorities | Before visit |
| Campus experience | What is daily life actually like? | Environment confidence | Show one campus in enough depth to decide whether to visit | Before visit |
| Admissions enquiries | What should I do next? | Low-friction handoff | Carry known programme/campus context into the visit or consultation step | After evidence |
| Institutional trust | Can I trust the claims and process? | Credibility | Put source-qualified programme/process information near decisions | Throughout |

## 3. Primary journey hypothesis

Primary behavioral context: a prospective parent comparing bilingual/international-school options, often before they are ready to submit personal information.

Target journey:

`Home → understand proposition → compare programme → find campus → inspect campus → request visit → admissions next step`

The redesign should not force every family through every page. Each deep page must still orient users who arrive directly.

## 4. Current page-family audit

| Page family | User question | What already works | Current gap / hypothesis | Decision |
| --- | --- | --- | --- | --- |
| Home | Is VAS worth considering and where do I begin? | Strong brand/editorial story, proof, programmes, campuses | The journey is rich but the decision sequence is not explicit early enough | IMPROVE |
| Programme | Which path is right for my child? | CEP/CAP/CAPI comparison, decision tool, academic journey | Strong enough; keep as the programme-decision surface | KEEP / POLISH |
| Campus finder | Which campus fits us? | Filters by level, programme, district and priorities | Visit CTA previously handed users to a generic admissions form and dropped finder context | IMPROVE |
| Campus detail | What is this place like? | Distinct Riverside composition and campus-life model | Visible implementation/documentation language breaks product realism | IMPROVE |
| Visit planner | How do we visit? | Honest requested-date model; no fake time-slot availability | Previously started as a fresh form and exposed internal “scheduler/conversion screen” language | IMPROVE |
| Admissions | How does application work? | Dedicated process, FAQ and enquiry intents | Keep as a later-stage admissions surface rather than the only visit path | KEEP |

## 5. Preserve list

The V2 pass deliberately preserves:

- VAS red / warm ink / gold visual system;
- Fraunces + Plus Jakarta Sans typography;
- existing programme comparison and path-finding tools;
- six-campus finder and distinct page roles;
- dedicated admissions and visit routes;
- guided-learning motion and reduced-motion behavior;
- current URLs and route structure;
- explicit “requested visit, confirmation later” truth boundary.

## 6. Visible redesign delta

| Current visible behavior | Why it matters | V2 behavior | Verification |
| --- | --- | --- | --- |
| Hero prioritizes consultation before self-guided decision support | A family may not yet be ready to submit information | Hero leads to Find My Path and a four-step decision journey | Home rendered review |
| Rich sections exist but no compact “what next?” sequence near the top | Users must infer the intended journey | New 01 Programme → 02 Campus → 03 Campus experience → 04 Visit path | Home rendered review |
| Campus finder visit CTA enters generic admissions visit intent | Selected campus/programme/level can be lost | Visit URL carries campus + selected programme + level | URL/runtime check |
| Visit planner starts from default state | Re-entry increases repetition | Planner hydrates from query context and surfaces that context in the summary | Interaction check |
| Riverside/visit pages expose internal design-documentation language | Breaks product realism | Copy is written for families, not portfolio reviewers | Content check |

## 7. Journey and edge cases

### Happy path
1. Home → Find My Path or programme comparison.
2. Programme context → Campus Finder.
3. Campus filters → select/inspect a campus.
4. Visit CTA → dedicated Visit Planner with context.
5. Parent chooses preferred date/time and contact details.
6. UI confirms only that the request was recorded; VAS still needs to confirm a real appointment.

### Edge cases
- Parent has no programme preference → visit remains possible and summary says “Chưa chọn”.
- Parent has no level preference → visit remains possible.
- Direct visit-page entry → no fake context banner.
- Invalid campus query → existing default campus remains rather than fabricating a match.
- No fake real-time slots, availability or confirmed appointments.

## 8. Priority matrix

| Finding | Evidence | User impact hypothesis | Effort | Priority |
| --- | --- | --- | --- | --- |
| Decision journey not explicit near Home hero | Source inspection | High — orientation | Medium | P1 |
| Campus context lost before visit | Source/runtime inspection | High — continuity | Low | P1 |
| Internal prototype language visible in product UI | Source inspection | High — credibility | Low | P1 |
| Validation still planned | No participant evidence supplied | High — evidence quality | Medium | P2 |
| Wider content claims require source maintenance | Public-content dependency | Medium — trust | Ongoing | P2 |

## 9. SEO / URL safety

V2 does not remove or rename existing public routes. Programme, campus, admissions and visit pages keep their current slugs. The change is primarily link routing, contextual query parameters and homepage hierarchy, so existing internal/deep links remain valid.

## 10. Redesign contract

The project should be recognizably different because the **decision architecture** is different, not because the brand was reskinned.

Success for this implementation pass means:
- the parent journey is visible in the first meaningful scroll after the hero;
- programme/campus decisions lead forward instead of ending in generic CTAs;
- visit context survives between pages;
- implementation language is removed from user-facing surfaces;
- no production capability or user outcome is invented.

Actual usability success remains **UNVERIFIED** until planned research is run.
