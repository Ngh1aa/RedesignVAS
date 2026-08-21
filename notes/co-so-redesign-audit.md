# Audit trang Cơ sở — RedesignVAS

## Phạm vi
Trang live hiện tại có hero “6 cơ sở, một chuẩn mực”, grid 6 card, section 4 điểm chung và CTA tư vấn/gọi điện. Nội dung đang thiên về catalogue; chưa có bộ lọc theo cấp học, khu vực hoặc ưu tiên gia đình; chưa có comparison table, campus life, FAQ hay map interaction.

## Nguồn dữ liệu chính
Theo brief `pasted_content_4.txt`, redesign dùng 6 cơ sở hiện được hệ thống VAS công bố: Sala, Riverside, Garden Hills, Sunrise, Hoàng Văn Thụ và Ba Tháng Hai. Không đưa Phan Xích Long vào navigation mới để tránh xung đột dữ liệu cũ nhắc 7 cơ sở.

| Cơ sở | Khu vực | Cấp học | Định vị chính |
|---|---|---|---|
| Sala | Thủ Đức | Mầm non → THPT | Mega Campus, không gian xanh, hoạt động ngoài trời |
| Riverside | Quận 7 | Mầm non → THPT | Campus lớn, mảng xanh, khoa học, ICT, nghệ thuật, thể thao |
| Garden Hills | Gò Vấp | Mầm non → THPT | Kiến trúc xanh, không gian mở, STEM, hồ bơi, sân bóng |
| Sunrise | Quận 7 | Mầm non → THPT | Khu đô thị Him Lam, đa chức năng, ngoại khóa, thể thao và nghệ thuật |
| Hoàng Văn Thụ | Phú Nhuận | Tiểu học → THPT | Vị trí trung tâm, thuận tiện đưa đón, học thuật và ngoại khóa |
| Ba Tháng Hai | Quận 10 | Tiểu học → THPT | Vị trí trung tâm, cơ sở lâu đời, phổ thông, xe đưa đón |

## Kết quả kiểm tra trực quan
Hero live đang có contrast tốt trên nền đỏ nhưng proposition cũ chưa nhấn vào lựa chọn phù hợp. Grid hiện dùng ảnh + text card, bố cục rõ nhưng thiếu hành động khám phá chi tiết và không giúp phụ huynh lọc theo nhu cầu. Hai lần cuộn cho thấy toàn bộ grid 6 cơ sở nằm trước section facilities; CTA cuối trang dùng “Đăng ký tư vấn” và đang cần được chuyển thành trải nghiệm “Đến và cảm nhận VAS” với luồng tham quan/tư vấn nhất quán.

## Quyết định UX tạm thời
Trang mới ưu tiên Campus Finder ngay dưới hero, sau đó là map-style campus overview, 6 campus editorial cards, comparison table, campus life, FAQ và CTA. Bộ lọc cần có trạng thái “6 cơ sở phù hợp”, empty state và nút reset. Bản đồ được triển khai ở dạng visual map mô phỏng bằng CSS/HTML để không thêm dependency bản đồ ngoài vào static site; mỗi marker chọn một cơ sở và cập nhật panel thông tin.

## Smoke test preview

Preview tạm thời render đầy đủ hero, Campus Finder, map view, 6 campus cards, comparison table, campus life, FAQ và CTA. Click bộ lọc **Quận 7** cập nhật đúng bộ đếm từ 6 xuống 2 và chỉ còn Riverside/Sunrise trong grid. Header scrolled giữ nền trắng, CTA hiển thị nhất quán là “Đăng ký tư vấn”.

Một lưu ý visual từ ảnh chụp preview: ở trạng thái anchor `#tim-co-so`, header cố định che một phần tiêu đề đầu panel khi trình duyệt tự căn anchor lên sát viewport. Đây là hành vi bình thường của anchor trên header fixed nhưng nên thêm `scroll-margin-top` cho section finder và map để khi click CTA, tiêu đề không bị che.

Anchor smoke test sau khi thêm `scroll-margin-top` vẫn render đúng toàn bộ Campus Finder và trạng thái filter đang được giữ bởi phiên trình duyệt trước đó; click **Đặt lại bộ lọc** đưa bộ đếm về 6 và render đủ 6 cơ sở. Bản preview xác nhận filter state, reset state và nội dung chính hoạt động đúng.

Preview URL: https://4178-ilx2iquflulobomgixahp-bfd4cbc5.sg1.manus.computer/co-so/
Live reference audited: https://ngh1aa.github.io/RedesignVAS/co-so/
