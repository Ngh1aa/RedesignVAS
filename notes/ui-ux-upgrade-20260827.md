# UI/UX upgrade — 27/08/2026

Mục tiêu: nâng RedesignVAS từ high-fidelity prototype lên trạng thái production-ready hơn mà không thay đổi art direction hiện tại.

## Nguyên tắc
- Giữ hệ màu, typography và storytelling hiện tại.
- Ưu tiên tính thật của navigation, search, admissions và thông tin hơn việc thêm component mới.
- Navigation phải dẫn đúng ngữ cảnh; không tạo cảm giác có trang con khi thực tế chỉ về trang cha.
- Search phải có hành vi thật và keyboard-accessible.
- Admissions phải minh bạch trạng thái preview/production và không tạo conversion giả.
- Các tool như học phí chỉ hiển thị dữ liệu khi có nguồn dữ liệu thật; nếu chưa có dữ liệu, chuyển thành luồng nhận biểu phí/tư vấn rõ ràng.
- Giữ target tương tác tối thiểu phù hợp WCAG 2.2, focus rõ và không bị sticky UI che.

## P0
1. Sửa mega/mobile navigation thành deep-link/anchor thật theo từng mục.
2. Biến nút search thành search overlay hoạt động, tìm nhanh các trang/section chính.
3. Làm rõ trạng thái form admissions: production endpoint vs preview local-only; tránh success giả.
4. Thay fee calculator giả bằng fee enquiry/preview state rõ ràng khi chưa có fee dataset thật.
5. Xóa/đổi toàn bộ copy mang tính developer/internal khỏi UI public.

## P1
1. Bổ sung utility navigation cho phụ huynh hiện tại: Tin tức, Liên hệ, Tuyển dụng/Portal khi có destination thật.
2. Chuẩn hóa tiếng Việt cho labels công cụ; giữ CEP/CAP/CAPI và thuật ngữ Cambridge khi cần.
3. Giảm lặp CTA/headline và giảm lặp từ “hành trình”.
4. Củng cố accessibility cho menu/search/form/sticky actions.
5. Chuẩn hóa design tokens và giảm declaration lặp.

## Tiêu chí hoàn tất
- Không còn item menu cấp 2 nào trỏ vô nghĩa về cùng trang cha nếu có section tương ứng.
- Search mở bằng click và phím `/`, đóng bằng Escape, hỗ trợ focus rõ.
- Form không báo “đã gửi” khi chưa có endpoint.
- Học phí không giả lập số liệu.
- Không còn copy như “redesign”, “preview data”, “section này…”, “cần kết nối…” trong nội dung public-facing.
