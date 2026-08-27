# Phase 4.5 — Final Visual QA & Bug Fix

Ngày: 27/08/2026

## Mục tiêu
Hoàn tất vòng kiểm tra UI/UX sau Phase 4 ở các breakpoint 390 / 768 / 1024 / 1440px, ưu tiên cảm giác dùng như website thật và sửa các lỗi interaction/responsive còn sót. Backend vẫn có thể mock.

## Đã triển khai

### 1. Hero / brand imagery
- Giữ stock image làm fallback nhưng preload ảnh VAS trước khi thay để tránh broken hero nếu asset lỗi.
- Chuẩn hóa alt text cho hero VAS.
- Tinh chỉnh object-position riêng cho Home, Về VAS, Chương trình, Cơ sở, Tuyển sinh, Tin tức, Vòng quanh VAS.
- Có object-position riêng cho mobile để hạn chế crop mất nhân vật/chủ thể.
- Hero mobile và màn hình thấp được giảm min-height/padding để không chiếm toàn bộ viewport.

### 2. Focus / accessibility
- Sửa focus visibility khi có fixed header, sticky section nav và mobile sticky CTA.
- Thêm scroll-padding/scroll-margin để keyboard focus không bị che.
- Giữ focus outline rõ và target chính >= 44px ở mobile.
- Dialog/search restore focus về control trước đó khi đóng.
- Backdrop dialog/lightbox/search luôn đóng được kể cả sau khi người dùng đã click trong panel.

### 3. Navigation
- Mega menu desktop đóng khi keyboard focus rời header.
- Mega menu hỗ trợ Escape-to-close và restore focus.
- Footer deep-link được map tới đúng section/campus/admissions destination thay vì chỉ về trang cha.
- Horizontal rails hỗ trợ Arrow Left/Right bằng keyboard.

### 4. Admissions
- Fix regression Phase 4 làm aria-invalid border quá nhạt/trắng: trả lại viền đỏ và focus ring lỗi rõ.
- Field error có surface đỏ nhạt và contrast tốt hơn.
- Success message hiển thị đúng flex state khi bỏ hidden.
- Fee result chống overflow với chuỗi dài.
- Input/select/textarea giữ font-size 16px trên mobile để tránh browser zoom.

### 5. Sticky / overlay collisions
- Chuẩn hóa z-index section nav / compare tray / sticky CTA / modal-search.
- Compare tray nằm phía trên sticky CTA trên mobile.
- Dialog/search có overscroll containment và max-height theo visual viewport.
- Compact-height phone/landscape có hero/menu/modal rule riêng.

### 6. Table / comparison
- Comparison tables giữ horizontal scroll nhưng sticky cột đầu để người dùng không mất ngữ cảnh.
- Header cell đầu tiên giữ màu brand đỏ khi sticky.
- Swipe hint từ Phase 4 tiếp tục hoạt động.

### 7. Image failure state
- Bắt image error ở content media.
- Nếu ảnh lỗi: không hiển thị broken-image icon; thay bằng VAS fallback surface nhẹ để layout không sập.
- Hero brand image dùng preload + fallback về src cũ nếu media VAS không tải được.

### 8. Responsive visual QA
- 390px: CTA hero full-width, section-nav target 44px, story excerpt clamp, archive text compact, safe-area footer/sticky.
- 768px: inner hero ~600px, grid/tablet giữ 2–3 cột hợp lý, story modal media giảm chiều cao.
- 1024px: typography/hero width và content density giữ cân bằng trước desktop lớn.
- 1440px: card height/rhythm đồng đều, không ép text line quá dài.

## Lỗi đã phát hiện và sửa
1. Admissions invalid state bị override thành border trắng ở Phase 4.
2. Keyboard focus có thể bị fixed header / section nav / mobile sticky CTA che.
3. Desktop mega menu mở bằng keyboard focus nhưng không tự đóng khi focus rời header.
4. Mega menu chưa có Escape-to-close.
5. Dialog backdrop có edge case: click trong panel trước có thể làm listener backdrop cũ bị consume.
6. Dialog/search không phải lúc nào cũng restore focus về trigger.
7. Footer links trên trang con còn trỏ destination cấp cha, làm giảm findability.
8. Brand hero thay trực tiếp external asset; nếu asset fail sẽ làm broken hero. Đã đổi sang preload + fallback.
9. Modal/search trên mobile có nguy cơ vượt chiều cao khi browser chrome/keyboard thay đổi viewport. Đã dùng visualViewport variable.
10. Comparison table horizontal scroll làm mất context hàng/cột; đã sticky first column.

## QA kỹ thuật
- Phase 4.5 CSS/JS đã được thêm vào asset loader cuối cùng để có quyền normalize các layer trước.
- Brand imagery asset đã bump version sau khi thêm preload fallback.
- Phase 4.5 JS đã bump cache version sau hardening navigation/footer.
- Asset directory đã xác nhận tồn tại: phase45-final-qa-20260827.css / .js.
- Không có GitHub Actions PR workflow gắn với commit cuối; project đang deploy dạng static/GitHub Pages từ branch.

## Còn lại sau Phase 4.5
- Không thêm feature mới trước khi visual lock.
- Nếu tiếp tục: Final content/image pass bằng mắt trên browser thực ở 390 / 768 / 1024 / 1440px, sau đó mới consolidate các patch CSS/JS cũ thành ít file hơn.
