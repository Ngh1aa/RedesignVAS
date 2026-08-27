# Phase 4 — UI/UX visual polish & responsive QA

Ngày: 27/08/2026

## Mục tiêu
Nâng RedesignVAS từ prototype tương tác tốt lên một concept website trường quốc tế có cảm giác hoàn thiện, nhất quán và gần production về UI/UX; backend vẫn có thể mock.

## Hoàn tất

### 1. Visual system
- Giữ Fraunces + Plus Jakarta Sans và đỏ VAS.
- Tạo tonal hierarchy mới: trắng / warm-white / brand red / deep red.
- Giảm radius ở button, card, media, dialog để bớt cảm giác SaaS/template.
- Giữ pill cho đúng ngữ nghĩa: filter, chip, tag, badge.
- Giảm shadow; chỉ dùng shadow rõ cho floating layer/dialog/compare tray.
- Chuẩn hóa line, surface, radius và shadow token ở Phase 4 layer.
- Section desktop gọn hơn; mobile giảm khoảng trống thừa.

### 2. Header / Navigation
- Header solid dạng translucent white nhẹ, active state bằng underline.
- Mega menu compact và editorial hơn.
- Search hiển thị trên mobile.
- Mobile menu chuyển thành full-height navigation panel.
- Burger có trạng thái mở/đóng, aria-expanded và Escape-to-close.
- Mobile accordion chỉ mở một nhóm menu cùng lúc.

### 3. Hero
- Home hero giảm cảm giác phủ đỏ toàn ảnh, giữ ảnh tự nhiên hơn.
- Inner-page hero gọn hơn, typography cân bằng và reveal phần nội dung kế tiếp tốt hơn.
- Thay hero stock ở các điểm chạm chính bằng asset VAS đang có trong hệ thống.
- Home outcome image dùng asset VAS thay stock.

### 4. Typography / content rhythm
- Heading dùng text-wrap balance.
- Eyebrow giảm tracking và kích thước để tinh tế hơn.
- Paragraph giới hạn line length.
- Tablet không ép các heading/card thành quá nhiều cột.

### 5. Home
- Kích hoạt Phase 3 quick actions từng bị thiếu loader.
- Quick actions: Tìm lộ trình / Tìm cơ sở / Học phí / Tham quan.
- Tablet card grid chuyển 2 cột trước khi lên desktop lớn.
- Mobile giảm vertical spacing và giữ swipe quick actions.

### 6. Chương trình
- Kích hoạt block “Bước tiếp theo” sau CEP/CAP/CAPI.
- Comparison table có mobile swipe hint + sticky first column.
- Pathway tabs trên mobile chuyển horizontal scroll.
- Cambridge rail/tablet xử lý overflow thay vì ép chữ.

### 7. Find My Path
- Giảm card radius, shadow và spacing.
- Option state rõ hơn khi hover/focus.
- Result card và fee summary gọn hơn.
- CTA result mobile full-width.
- Giữ full flow giống sản phẩm thật nhưng dữ liệu có thể mock.

### 8. Cơ sở
- Finder panel compact, button/filter target rõ.
- Campus cards giảm radius, shadow và hover scale.
- Map/card responsive lại cho mobile.
- Compare tray và compare modal giữ nổi nhưng không đè sticky CTA.
- Tablet featured campus card cân bằng lại 50/50.

### 9. Tuyển sinh
- Form card giảm radius, focus state rõ, font input 16px trên mobile.
- Fee estimate và form success giữ interaction production-like.
- Admissions Journey sửa layout 7 bước: desktop 7 cột, tablet horizontal rail, mobile vertical.
- Mobile ẩn progress text lặp để giảm noise; giữ completion meter.
- CTA học phí mobile full width.

### 10. Tin tức
- Tablet: News/Activity 2 cột thay vì 3.
- Tablet archive 3 cột thay vì 5.
- Event/card radius và spacing gọn hơn.
- Mobile story/news/archive giảm density và font size phù hợp.
- Giữ filter, quick article modal, event modal và gallery lightbox.

### 11. Vòng quanh VAS
- Fix alias token cho các module legacy (--red/--ink-muted/--serif).
- Sport/community/care layout tablet giảm gap.
- Timeline mobile giảm cột thời gian và tránh wrap sai.
- Club/tag/project module gọn hơn trên mobile.

### 12. Về VAS
- Story proof responsive 5 → 3/2 cột phù hợp.
- Leadership/timeline spacing gọn hơn.
- Mobile quote, university journey và visual timeline được compact.

### 13. Accessibility / interaction QA
- Dialog/search có keyboard focus trap.
- FAQ chuyển single-open accordion theo group.
- Section nav active item tự pan vào viewport.
- Table overflow có hint “Vuốt để xem thêm”.
- Mobile menu Escape-to-close.
- Images non-hero lazy-load; hero fetch-priority high.
- Respects prefers-reduced-motion.
- Sticky mobile CTA chừa safe-area và không che nội dung cuối trang.

### 14. Runtime / loader consolidation
- Refactor motion-system loader thành helper addCss/addJs.
- Script động dùng async=false để giữ execution order.
- Kích hoạt Phase 3 decisions CSS/JS bị thiếu trước đó.
- Phase 4 được load cuối để normalize các patch cũ mà không phá page styles.
- Observer Phase 4 được giới hạn phạm vi/thời gian để giảm runtime overhead.

## Còn lại cho vòng QA sau
- Kiểm tra crop/focal-point của từng hero/campus image trên 390 / 768 / 1024 / 1440px.
- Rà các ảnh ngoài VAS còn lại trong content cards và thay dần nếu cần.
- Visual pass cuối cho footer và một số card do dữ liệu động tạo ra.
- Sau khi visual đã khóa: có thể merge các patch CSS/JS cũ thành ít file hơn; không làm trước khi design ổn định để tránh regression.
