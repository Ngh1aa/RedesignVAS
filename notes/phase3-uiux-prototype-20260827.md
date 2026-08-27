# Phase 3 — UI/UX prototype realism — 27/08/2026

## Mục tiêu
Tập trung vào giao diện và trải nghiệm người dùng. Prototype được phép mô phỏng dữ liệu/backend để người dùng thao tác giống website thật.

## Nguyên tắc
- Không chặn flow chỉ vì chưa có CRM/API/backend.
- Mock data phải phục vụ UX và có logic nhất quán.
- UI bên ngoài phải giống production, không hiển thị copy kiểu developer/local-only/prototype.
- Ưu tiên decision support, progressive disclosure, feedback state và mobile interaction.
- Giữ art direction hiện tại của RedesignVAS.

## Đã triển khai

### Home
- Quick-action strip ngay sau hero.
- 4 hành động chính: Tìm lộ trình / Tìm cơ sở / Ước tính học phí / Tham quan VAS.
- Mobile chuyển thành horizontal cards để không kéo dài homepage.

### Chương trình
- Giữ quiz CEP/CAP/CAPI hiện tại.
- Thêm block “Bước tiếp theo” theo lộ trình đang chọn.
- CTA có context sang Campus Finder và Admissions.

### Cơ sở
- Có thể chọn tối đa 3 cơ sở để so sánh.
- Bottom compare tray.
- Comparison modal có hình ảnh, khu vực, cấp học, điểm nổi bật và CTA tham quan.
- Tự gắn lại nút Compare sau khi Campus Finder re-render.

### Tuyển sinh
- Không còn chặn form khi thiếu backend.
- Validation → loading state → success state như web thật.
- Intent: Nhận tư vấn / Tham quan / Dự tuyển vẫn giữ context riêng.
- Form completion meter.
- Payload mock lưu local để giữ continuity khi test.
- Fee calculator trả mức ước tính có logic theo cấp/lộ trình/cơ sở/hình thức thanh toán.
- Copy hiển thị theo kiểu production; số học phí chỉ là mức tham khảo.

### Tin tức
- Filter category cho tin mới nhất.
- Quick-reading modal khi bấm Đọc tiếp.
- Event detail modal + mô phỏng đăng ký thành công bằng toast.
- Gallery lightbox.

### Trang con
- Sticky “Khám phá” section navigation cho trang dài.
- Active section tự cập nhật theo scroll.
- Horizontal scroll trên mobile.

### Accessibility / feedback states
- Dialog đóng bằng Escape.
- Focus vào close button khi mở dialog.
- Toast dùng role=status / aria-live.
- Control chính duy trì target lớn.
- prefers-reduced-motion được tôn trọng.

## Phase tiếp theo
1. Responsive QA ở 360 / 390 / 768 / 1024 / 1440.
2. Visual consistency audit: radius, border, card density, typography rhythm, image ratio.
3. Consolidate các patch CSS/JS cũ thành ít layer hơn.
4. Kiểm tra toàn bộ CTA self-link/dead-end.
5. Kiểm tra content density từng trang và loại bỏ block trùng intent.
6. Tăng visual authenticity bằng media VAS thay vì stock ở các vị trí quan trọng.
7. Polish hover/focus/loading/empty/success state toàn hệ thống.
