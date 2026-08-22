# RedesignVAS UX Upgrade — Implementation Plan

## Design thesis

Giữ nguyên cảm xúc editorial, ấm áp và lấy học sinh làm trung tâm của RedesignVAS; bổ sung một lớp decision support để phụ huynh đi từ **grade → programme → campus → fee → next action** mà không biến website thành dashboard.

## Current source of truth

GitHub Pages đang phục vụ bộ HTML/CSS/JS tĩnh ở root và các thư mục con. Thư mục `src/` là bản React prototype, không phải nguồn đang hiển thị tại URL production. Vì vậy sprint này chỉnh sửa static implementation và dùng lại `assets/base.css`, `assets/shared.js`, `styles.css` hiện có.

## P0 scope implemented in this sprint

| Area | Route / location | Output |
|---|---|---|
| Global CTA | Homepage + shared subpage chrome | Tách `Nhận tư vấn`, `Tham quan VAS`, `Đăng ký dự tuyển`; giữ một CTA chính ở header và sticky mobile |
| Find My Path | `/find-my-path/` | 3-step flow: grade → direction → recommendation; campus availability, fee overview, next actions; URL state |
| Programme comparison | `/chuong-trinh/#so-sanh` | Mobile-friendly tabs/accordion-style comparison entry and Find My Path CTA |
| Homepage continuity | `/` | Deep links từ proof, programme, campus, outcomes, admissions; không reorder storytelling |
| Campus Finder | `/co-so/` | Thêm programme filter, URL state, valid campus/programme mapping, tour/fee/contextual links |
| Tuition | `/tuyen-sinh/#hoc-phi` | Central data model in JS, school year, grade/programme/campus/payment plan, fee overview and next actions |
| Admissions | `/tuyen-sinh/` | Intent branch (Inquire / Visit / Apply), short inquiry form, separate tour form fields, inline validation, submitting/success/error states, context preservation |

## Decision data model

All browser-side data is local and explicitly marked as **tham khảo** where official backend/CMS data is not available. Fee values are demo-safe ranges rather than claims of official tuition; the UI presents the school year and directs families to confirm with admissions.

```js
Programme { id, code, label, description, levels, campuses }
Campus { id, name, district, levels, programmes, phone, ... }
TuitionFee { schoolYear, campusId, grade, programme, paymentPlan, amount, currency }
Lead { source, landingPage, parentName, phone, email, childGrade, preferredProgram, preferredCampus, intent, message }
```

## Key interaction rules

1. Do not rank CEP, CAP and CAPI as basic/advanced/premium. Recommendations use neutral language: “gợi ý để tìm hiểu”.
2. Invalid grade/programme/campus combinations are not shown as available results.
3. Inquiry is intentionally short. Application documents, medical history and uploads are not requested in this public form.
4. Tour uses preferred date/time, not fake real-time availability.
5. Success states preserve grade/programme/campus context and offer contextual next actions.
6. Mobile uses one-column forms, large touch targets, inline errors and a sticky action bar that does not cover content.
7. Existing typography, color tokens, spacing, image treatment, animation and CTA shapes are reused. New CSS is additive and scoped to the new functional blocks.

## Analytics hooks

The implementation emits a small `window.dataLayer` event for `hero_inquiry_click`, `hero_explore_click`, `find_my_path_complete`, `programme_compare_view`, `campus_filter`, `inquiry_submit`, `tour_submit`, and `apply_start`. No external analytics dependency is introduced.

## Known production follow-ups

Official tuition tables, grade/programme availability, entry requirements, privacy policy URL, CRM endpoint and production campus photography must be connected to approved CMS/backend data before public operational use. The current static implementation provides the UX contract and local fallback states only.
