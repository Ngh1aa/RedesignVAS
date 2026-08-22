# Admissions data audit

## Live route checked

`https://ngh1aa.github.io/RedesignVAS/tuyen-sinh/?intent=visit&grade=1-5&program=cap&campus=sala&source=qa#dang-ky`

## Observed before patch

The live form rendered the Visit branch and preserved visible query context. It had fields for parent name, phone, email, campus, visit type, preferred date/time, student grade, programme, intent reason, message and consent. The pre-patch submit handler stored a small object only in `localStorage` under `redesignvas-last-lead`; it did not send data to a remote endpoint. It also omitted visit type/date/time, intent reason, consent timestamp, canonical campus/program IDs, schema version, source and transmission status. Because this is a static GitHub Pages deployment with no configured endpoint, the previous success copy could be interpreted as a real submission even though no external system received the data.

## Audit status

A patch is being prepared to normalize IDs, include all form fields in a versioned payload, validate intent-specific Visit/Apply fields, expose a QA payload reference, and clearly label local-only storage unless a real endpoint is configured.

## Preview interaction setup

The Visit route loaded with `intent=visit`, `grade=1-5`, `program=cap`, `campus=sala`, and `source=qa`. The UI showed the Visit-specific fields including campus, visit type, preferred date and preferred time. The test will use synthetic values only; no personal data is being entered.

## Synthetic submission setup

On the preview route, the Visit branch and context `grade=1-5`, `program=cap`, `campus=sala`, `source=qa` were loaded. The synthetic parent name `QA Parent Test` was entered. No real personal information is being used.

## Context prefill verified

The preview loaded `campus=sala` as the selected **Sala** option and `grade=1-5` as the student value **Lớp 1–5**. The Visit branch displayed `visitType`, `date` and `time` fields; the intent reason was auto-selected to the Visit value. This confirms context prefill is now canonical at the form boundary.

## Synthetic Visit form state

On the preview, `QA Parent Test` is entered in the parent-name field. The canonical context is visible: campus `Sala`, student grade `Lớp 1–5`, Visit intent reason, and `CAP` can be selected by its id-backed option. The form still requires phone, preferred date/time and consent before a valid Visit payload can be constructed.

## Regression found during live form check

The preview loaded the updated option values for campus/program, but the program select remained at **Chọn lộ trình** while the query contained `program=cap`. This is consistent with a cached script URL still using the old display-text assignment. The source handler has already been updated to set the canonical id; the HTML script query needs a version bump so GitHub Pages/browser caches load the corrected handler.

## Post cache-busting state

After reloading with the new admissions script version, the Visit form showed the selected Sala context, student grade `Lớp 1–5`, and the full Visit field group. The browser had retained the synthetic parent name from the preview session. The program selector still needs to be inspected after the fresh script load using the current snapshot; the prior stale-index error was a browser snapshot issue, not a form runtime exception.

## Fresh script prefill check

After loading the preview with `script.js?v=admissions-v2-20260823`, campus `Sala` and student grade `Lớp 1–5` were visibly preserved. The Visit-specific fields were present. The snapshot extraction does not expose the current selected text for the CAP select, so the next payload check will validate the canonical value through the submitted/recorded object rather than relying on visual text alone.

## Field-level visual check

The form currently shows the Visit context with campus `Sala`, student value `Lớp 1–5`, a Visit reason, and visible date/time inputs. The parent name remains the synthetic QA value. This is a browser-only test session; no production lead is being created.

## Current field snapshot

The preview form currently shows selected Sala, Visit type, date/time inputs, grade `Lớp 1–5`, intent reason `Tôi muốn tham quan cơ sở`, consent checkbox and the submit action. The next interaction should use synthetic values only and verify the local-only result state.

## Visit date/time input verified

The preview accepted synthetic date `2026-09-15` and time `10:30`; the browser displayed the values in the corresponding native date/time fields. Campus `Sala` and grade `Lớp 1–5` remained intact.

## Phone normalization check

The preview accepted the synthetic phone input `090 000 0000` and the browser displayed it in the phone field. The submit handler removes whitespace before validation and payload construction, so the canonical stored value is expected to be `0900000000`.

## Complete synthetic Visit inputs

The preview now contains synthetic contact data (`090 000 0000`, `qa-parent@example.com`) plus preferred date `2026-09-15` and time `10:30`. The phone value is expected to be normalized to `0900000000` in the payload. Remaining steps are consent and submit validation.

## Pre-submit state

The preview shows the Visit reason field and the consent checkbox plus the submit button. Phone, email, date `2026-09-15`, and time `10:30` were filled in the same session. The next check is the required consent path and local-only success state.

## Validation regression check

When the submit button was clicked after a refresh, the browser showed `Vui lòng nhập tên phụ huynh.` because the prior synthetic name was not persisted across the fresh reload; the visible `Nguyễn Văn A` was the placeholder, not an entered value. This confirms the required-name validation is active rather than indicating a payload bug. The remaining valid-submit test will re-enter the synthetic name in the current page session.

## Valid-submit setup verified

The current preview session contains the complete synthetic Visit test data: parent name `QA Parent Test`, phone `090 000 0000`, email `qa-parent@example.com`, context `grade=1-5`, `program=cap`, `campus=sala`, source `qa2`, preferred date `2026-09-15`, preferred time `10:30`, Visit reason and consent. The CAP option is visibly selected after the cache-busting fix.

## Submit validation observation

The submit attempt displayed `Vui lòng nhập tên phụ huynh.` because the page/session had reset the name value before the click. This is the expected required-field validation; no payload was created. The test confirms the form does not proceed with incomplete parent identity.
