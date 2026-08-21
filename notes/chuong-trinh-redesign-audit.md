# Audit trang Chương trình — 2026-08-21

## Brief mới
- Hero: “Một hành trình. Nhiều hướng đi.”; trả lời câu hỏi phụ huynh “Con tôi sẽ đi như thế nào?”.
- Source of truth chỉ gồm 3 lộ trình CEP / CAP / CAPI.
- Cần comparison rõ ràng, không xếp hạng tốt nhất.
- Cần bản đồ hành trình: 16 năm, Cambridge Journey, chứng chỉ, đầu ra đại học.
- Cần giải tỏa lo lắng: có thể chuyển lộ trình, học song song có quá tải không, yêu cầu tiếng Anh.
- Cần mini decision tool/quiz và FAQ.
- CTA chính: “Tìm lộ trình phù hợp cho con”; CTA tư vấn: “Đăng ký tư vấn”.

## Cấu trúc được đề xuất
1. Hero: Một hành trình. Nhiều hướng đi.
2. Statement: Không có lộ trình tốt nhất, chỉ có lộ trình phù hợp nhất.
3. So sánh CEP / CAP / CAPI.
4. Mini quiz tìm lộ trình.
5. Hành trình 16 năm theo cấp học.
6. Cambridge Journey từ lớp 1 đến A Level.
7. Ba lộ trình chi tiết (CEP/CAP/CAPI).
8. Các mốc chứng chỉ và đầu ra sau lớp 12.
9. Chuyển tiếp giữa các lộ trình.
10. Tích hợp MOET + Cambridge và tải học tập.
11. Mức độ tiếng Anh theo lộ trình.
12. FAQ.
13. CTA cuối trang.

## Audit implementation hiện tại
- `chuong-trinh/index.html` hiện chỉ có hero, stages, programmes, method, certificates và CTA; thiếu comparison, quiz, timeline Cambridge, outcomes/university, transfer, English load, FAQ.
- `chuong-trinh/script.js` đang render STAGES, PROGRAMMES, CERTS và tab panel; có thể mở rộng thành data-driven sections.
- `chuong-trinh/styles.css` chỉ có style cho programme tabs/panel; cần thêm styles cho comparison, quiz, timeline, cards, FAQ, responsive.
- `site/chuong-trinh/*` là mirror bắt buộc đồng bộ.
- Trang live đang hiển thị header/hero đỏ, nền trắng; hero nội dung đã dịch phải trên desktop theo base.css.
- Header live vẫn hiển thị CTA “Đặt lịch tham quan” trong tool extract, cần kiểm tra lại cache/deploy hoặc shared.js source trước khi kết luận; CTA nội dung trang hiện tại đã là “Đăng ký tư vấn”.

## Nguyên tắc triển khai
- Giữ editorial tối giản, nền trắng cho các section sáng, đỏ VAS dùng cho statement/CTA và section cần nhấn.
- Không đưa học phí vào section Chương trình.
- Không dùng “tốt nhất / thấp nhất” để xếp hạng lộ trình.
- Tất cả claim chương trình phải dùng ngôn ngữ thận trọng như brief (“VAS hiện mô tả”, “tùy cấp học/lộ trình”).
- Ưu tiên semantic HTML, keyboard access, focus-visible, reduced motion và mobile responsive.

## Preview validation
- Preview local render thành công với title mới và toàn bộ nội dung mới; header khi solid hiển thị CTA “Đăng ký tư vấn”.
- Hero desktop: heading lớn, contrast tốt trên nền đỏ; hai CTA hiển thị rõ.
- Statement editorial render tốt trên nền trắng, thông điệp chính nổi bật.
- Comparison table render đúng trên desktop, có wrapper cuộn ngang cho viewport hẹp.
- Quiz hiển thị câu 1/4 và option buttons trong panel đỏ; nội dung phía sau không bị JavaScript error.
- Hành trình 16 năm, Cambridge Journey, detail tabs, outcome, transfer, integration, English chart và FAQ đều xuất hiện trong extracted page content.
- Không còn chuỗi “Đặt lịch tham quan” trong hai thư mục `chuong-trinh` và `site/chuong-trinh`.
- Header live/preview trên page mới đã thống nhất CTA “Đăng ký tư vấn”.
