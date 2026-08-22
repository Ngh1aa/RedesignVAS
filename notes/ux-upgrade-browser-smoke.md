# UX Upgrade Browser Smoke Notes

## Preview checked

URL: temporary local preview root. The homepage rendered successfully after static HTML/JS changes.

## Observed

The existing hero image, red editorial treatment, typography, spacing and overall section order remain intact. Header primary CTA now reads **Nhận tư vấn**. Hero CTA pair reads **Nhận tư vấn** and **Khám phá VAS**. Proof cells now expose **Xem bằng chứng →** deep-link affordances. The Learning Journey exposes **So sánh CEP · CAP · CAPI** and **Tìm lộ trình phù hợp**. Campus block exposes **Tìm cơ sở phù hợp**. Admissions block exposes three distinct actions: **Nhận tư vấn**, **Tham quan VAS**, and **Đăng ký dự tuyển**.

## Follow-up checks

Next smoke tests should verify the new `/find-my-path/`, `/tuyen-sinh/`, and `/co-so/` routes, URL-state persistence, and a mobile viewport. There are still legacy placeholder links in the unrelated `site/` mirror and some news/footer content that are outside this P0 upgrade path.

## Find My Path interaction

The route rendered with the existing header/footer language. Selecting `Lớp 1–5` changed the URL to `?grade=3` and advanced the UI to **Bước 2 / 3 · Định hướng**. The four neutral direction options and **Quay lại bước trước** control were visible and usable. Visual continuity remained consistent with the current subpage treatment.

## Find My Path result

Choosing the balanced direction produced `?grade=3&direction=balanced&program=cap`, a neutral **CAP có thể là một điểm bắt đầu phù hợp** recommendation, six valid campus results, and no premium/basic ranking language. Selecting Sala produced `&campus=sala`, displayed the 2026–2027 fee state, and exposed **Tham quan Sala**, **Nhận tư vấn**, and **Xem học phí** actions. Because approved fee data is not present in this static repository, the UI correctly shows a non-dead-end fallback rather than inventing a tuition amount.

## Admissions route

The admissions route rendered with `intent=visit`, `grade=1-5`, `program=cap`, and `campus=sala`. The page showed separate **Nhận tư vấn / Tham quan VAS / Đăng ký dự tuyển** intent tabs, a Visit-specific description stating that the team confirms the preferred date rather than claiming realtime slots, the 7-step admissions journey from Inquire to First Day, the 2026–2027 fee calculator, consent copy, and the short form. The form submit label changed to **Gửi yêu cầu tham quan**.

## Campus Finder route

The Campus Finder rendered a programme dimension with CEP/CAP/CAPI buttons alongside grade, district and priority. The URL `?program=capi&level=thpt#tim-co-so` loaded the THPT/CAPI-compatible context and exposed contextual **Tham quan** actions on the map card and editorial campus entries. The count remained six because the current local decision dataset marks all six campuses as supporting CAPI for THPT; this is explicitly a data governance follow-up before production.

## Admissions inquiry branch

The default `?intent=inquire#dang-ky` route shows the inquiry copy, no tour-only fields, the short required contact form, explicit needs selector, and consent link. The submit label is **Gửi nhu cầu**. The admissions page retains a single visual conversion block while branching intent inside it, so the homepage remains editorial rather than becoming a form landing page.

## Admissions validation

Submitting the empty inquiry form on the preview produced the inline error **Vui lòng nhập tên phụ huynh.** and returned focus to the parent-name field. This confirms the form does not rely only on a generic browser alert and blocks submission before the required contact data and consent are complete.

## Live deployment

The first live check immediately after push returned a temporary GitHub Pages 404 while the Pages workflow was still building. `gh api repos/Ngh1aa/RedesignVAS/pages` reported `status: building`, and the Pages deployment workflow then completed successfully. A second live check of `https://ngh1aa.github.io/RedesignVAS/find-my-path/?grade=3&direction=balanced&program=cap&campus=sala` returned the expected Find My Path title, CAP recommendation, Sala selection, 2026–2027 fee fallback, and contextual actions. The current live site is serving the upgrade.

## Regression audit follow-up

Static audit found two classes of remaining issues: visible placeholder `href="#"` links on the homepage and several legacy admissions CTAs on secondary pages. These have now been replaced with real internal routes. A live/preview regression check of `/co-so/` and `/tuyen-sinh/?intent=visit&campus=sala#dang-ky` confirmed both routes render and the Visit branch is selected; the campus-id mapping fix is ready for the next deployment check.
