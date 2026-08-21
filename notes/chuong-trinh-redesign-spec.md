# Thiết kế lại trang Chương trình — UX spec

## Design thesis
Trang Chương trình trở thành “bản đồ tương lai” giúp phụ huynh trả lời nhanh ba câu hỏi: con sẽ đi theo lộ trình nào, mỗi chặng nhận được gì, và sau lớp 12 có những cánh cửa nào.

## Hệ thống trải nghiệm
- Giữ visual editorial tối giản: nền trắng, chữ Fraunces cho display, Plus Jakarta Sans cho body, đỏ VAS và vàng kim làm accent.
- Primary action: `Tìm lộ trình phù hợp cho con` → mở mini quiz ngay trên trang.
- Secondary action: `Đăng ký tư vấn` → `../tuyen-sinh/#dang-ky`.
- Progressive disclosure: comparison trước; detail lộ trình sau; FAQ dùng `<details>`.
- Không gắn nhãn chương trình theo cấp độ tốt/xấu. Dùng “phù hợp với”.

## IA triển khai
1. Hero proposition + CTA.
2. Editorial statement: Không có lộ trình tốt nhất.
3. Comparison table desktop / stacked cards mobile.
4. Decision tool 4 câu hỏi, kết quả động.
5. 16-year map: Mầm non → Tiểu học → THCS → THPT.
6. Cambridge journey: Checkpoint → IGCSE → AS → A Level.
7. Detail cards/tabs cho CEP, CAP, CAPI.
8. Outcomes: chứng chỉ và lựa chọn đại học.
9. Transfer reassurance: CEP ↘ CAP ↘ CAPI và CAP ↔ CAPI.
10. Workload integration: MOET + Cambridge → tích hợp, không học lặp.
11. English intensity: CEP/CAP 50–56%, CAPI 62–80%, kèm “tùy cấp học/lộ trình”.
12. FAQ phụ huynh.
13. CTA cuối.

## Interaction contract
- Các tab lộ trình dùng button, có `aria-selected`, không cần reload.
- Quiz dùng button options, cập nhật progress, có nút quay lại và reset; sau câu 4 render kết quả đề xuất.
- Quiz không thu thập dữ liệu cá nhân; CTA tư vấn mới dẫn tới form.
- Timeline dùng CSS grid desktop, cuộn ngang nhẹ trên mobile nếu cần; không phụ thuộc JS.
- FAQ dùng native details/summary, accessible và không có accordion custom gây mất keyboard behavior.

## Content safeguards
- Dùng đúng 3 lộ trình CEP/CAP/CAPI như brief.
- Với các thông tin tỷ lệ/thời lượng/chứng chỉ, giữ qualifier “VAS hiện công bố/mô tả” và “tùy cấp học/lộ trình”.
- Không đưa học phí vào page này dù FAQ mention câu hỏi học phí; để CTA tư vấn xử lý.
