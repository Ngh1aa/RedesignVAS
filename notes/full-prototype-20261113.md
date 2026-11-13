# Full prototype — 13/11/2026

Branch `feature/full-prototype`. Mục tiêu: website chạy như thật, chỉ thiếu backend.

## Kiến trúc
- `assets/vas-prototype-data.js` — nguồn dữ liệu duy nhất (cơ sở, lớp, bảng phí mô phỏng, khung giờ tham quan và khung đã kín, tin bài, học bổng, vị trí tuyển dụng, dữ liệu người dùng ban đầu rỗng).
- `assets/vas-prototype.js` — kho `sessionStorage` (`vas-prototype-v1`), yêu cầu giả lập có độ trễ, cờ "mô phỏng lỗi ở lần gửi tiếp theo" (`vas-prototype-fail-next`), dialog/toast/field/validation dùng chung, thanh công cụ prototype ở chân trang (Hồ sơ của tôi, Lịch của tôi, mô phỏng lỗi, **Đặt lại dữ liệu demo**).
- `assets/vas-prototype-flows.js` — luồng theo trang. `assets/vas-prototype.css` — style dùng token sẵn có.
- Mọi xác nhận ghi rõ: bản prototype, chưa có thông tin nào được gửi tới VAS.

## Luồng
- Tuyển sinh: hồ sơ 5 bước (học sinh, phụ huynh, cơ sở & lộ trình, giấy tờ chỉ ghi tên tệp, xem lại) → mã `HS-…`; lưu nháp, tiếp tục sau reload; Hồ sơ của tôi (xem, sửa nháp, xóa nháp, rút hồ sơ, `?ho-so=` không tồn tại); ước tính học phí có ưu đãi anh chị em và dịch vụ thêm, đẩy sang hồ sơ; form tư vấn lưu vào sessionStorage.
- Đặt lịch tham quan: cơ sở → ngày (ngày kín) → khung giờ (khung đã kín) → thông tin → xác nhận `TQ-…`; Lịch của tôi: đổi lịch, hủy lịch, `?lich=` không tồn tại; deep link `?campus=&date=&slot=`.
- Tìm lộ trình: lưu kết quả, mang sang hồ sơ (`?from=path`), xóa kết quả.
- Học bổng: kiểm tra điều kiện, nộp hồ sơ `HB-…`, rút hồ sơ.
- Tin tức: lọc chủ đề, tìm kiếm (không dấu), xem thêm, chi tiết `?bai=`, không tìm thấy, tải lỗi có "Tải lại".
- Cơ sở: bộ lọc có trạng thái rỗng, chi tiết cơ sở `?chi-tiet=` (khung giờ trống gần nhất, học phí tham khảo), không tìm thấy.
- Tuyển dụng: danh sách, lọc, tìm, chi tiết `?vi-tri=`, ứng tuyển với tên tệp CV `UV-…`, đã ứng tuyển, rút đơn.
- Cựu học sinh: đăng ký `CHS-…`, cập nhật, rời mạng lưới. Liên hệ: form `LH-…`, đồng bộ với bộ chọn nhu cầu; thêm mục Chính sách bảo mật.

## Sửa lỗi
- `ve-vas`: `imageUrl is not defined` (lỗi JS của audit) làm mất lưới đội ngũ.
- `co-so`: vòng lặp MutationObserver ↔ `textContent` của nút "So sánh +" có thể treo trang sau khi lọc.
- Neo hỏng (`#lich-su`, `#thanh-tich`, `#privacy`, `#hanh-trinh-dai-hoc`), `href="#"` ở design-system, component-states và bản `site/`.
- `find-my-path`: observer phí học trong `vas-content-upgrades.js` ghi lại cùng nội dung mỗi lần, gây vòng lặp khi đã chọn cơ sở.
- Đặt lại dữ liệu demo trên trang có `#hash` không tải lại trang: nay dùng `location.reload()`.
- Lỗi static-check (chữ < 12px, " · ", aria-label thiếu role, tên nút bản đồ) trên 16 trang chính.
- `assets/contrast-aa-20261113.css` (nạp cuối): chữ mờ trên nền đỏ, vàng trên nền sáng, nền dự phòng tối cho hero/thẻ ảnh, scrim header, tràn ngang ở 390/320 px.
- Nhãn tiếng Anh còn sót trên các trang mở rộng đã chuyển sang tiếng Việt.

## QA
- `qa/inventory.cjs` — liệt kê và bấm mọi điều khiển (`--mobile` thêm 390px).
- `qa/e2e.cjs` — kiểm thử đầu-cuối. `python -m http.server` trên Windows đôi khi từ chối kết nối (backlog 5); test tự tải lại và in số lần tải lại.
- Cách chạy: `py -3 -m http.server 8927 --bind 127.0.0.1`, đặt `NODE_PATH` tới Playwright, `node qa/e2e.cjs`.
