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

## Phase 1 — đã triển khai
- Search overlay hoạt động bằng click, `/` và Escape.
- Form admissions không còn báo gửi thành công khi chưa có endpoint.
- Fee calculator chưa có dataset thật được chuyển sang trạng thái nhận biểu phí rõ ràng.
- Target/focus được nâng cấp cho keyboard và mobile.
- Deep-link navigation bước đầu được thêm cho mega menu/mobile menu.

## Phase 2 — đã triển khai 27/08/2026
### Navigation / IA
- Sửa lại deep-link theo ID thật của Tin tức, Vòng quanh VAS, Tuyển sinh và các trang chính.
- Bổ sung anchor runtime cho Về VAS: câu chuyện, giá trị, lịch sử, thành tích, đầu ra đại học, đội ngũ.
- Menu từng cơ sở chuyển sang URL có `campus` context để đưa người dùng đến đúng card cơ sở.
- Active navigation bổ sung `aria-current="page"`.

### Home
- Hero copy chuyển từ mô tả cảm tính sang thông tin cụ thể hơn: Mầm non → Lớp 12, Cambridge, CEP/CAP/CAPI, 6 cơ sở.
- Giảm lặp từ “hành trình” ở heading giáo viên và link câu chuyện học sinh.

### Chương trình
- Chuẩn hóa các label “Decision tool”, “Cambridge journey” sang tiếng Việt.
- Giữ CEP/CAP/CAPI và Cambridge là thuật ngữ học thuật chính.
- Table comparison được bảo vệ overflow trên mobile.

### Cơ sở
- “Campus finder” → “Tìm cơ sở”; “Campus life” → “Trải nghiệm tại cơ sở”.
- Sửa dữ liệu Ba Tháng Hai theo thông tin VAS hiện tại: Mầm non → THPT.
- Hoàng Văn Thụ giữ Tiểu học → THPT.
- FAQ, comparison table và map card đồng bộ lại thông tin cấp học.
- Hỗ trợ deep-link `?campus=<id>` và highlight đúng cơ sở.
- Finder count có `aria-live`.

### Tuyển sinh
- “Admissions journey” → “Các bước tuyển sinh”.
- Rút headline phần journey thành “Từ tìm hiểu đến ngày đầu tiên”.
- Copy học phí chuyển sang hành vi thật: chọn nhu cầu để VAS chuẩn bị biểu phí đúng, không giả lập con số.
- Giữ 3 bước tuyển sinh chính theo thông tin VAS hiện tại.

### Tin tức
- “News / Stories / Events / Life at VAS / Visual archive” được chuẩn hóa sang tiếng Việt.
- Xóa ghi chú CMS/internal khỏi public UI.
- CTA đầu trang chuyển từ “Nhận tư vấn” sang “Xem tin mới nhất”.
- Bỏ CTA tuyển sinh trong block sự kiện vì sai intent.
- “Xem tất cả tin tức” dẫn tới kho tin chính thức của VAS.

### Vòng quanh VAS
- Chuẩn hóa caption và label tiếng Việt.
- Loại self-link giả ở Thể thao/Cộng đồng; chuyển sang nguồn tin VAS có nội dung thật.
- Sửa link Cựu học sinh về đúng anchor đầu ra đại học.

### Utility / current families
Footer bổ sung:
- Cổng phụ huynh & học sinh.
- Thanh toán học phí.
- Tuyển dụng.
- Liên hệ.

### Responsive / Accessibility
- Scroll margin cho fixed header.
- Section padding mobile giảm để trang dài dễ scan hơn.
- Hero mobile compact hơn.
- Touch target tối thiểu khoảng 44px cho các control chính.
- Table so sánh scroll ngang thay vì ép chữ.
- Focus state rõ hơn cho header/mega/mobile menu.

## Còn lại trước production thật
1. Kết nối CRM/API admissions thật.
2. Kết nối fee dataset 2026–2027 thật.
3. Tạo page detail thật cho từng campus/cấp học nếu scope production yêu cầu; không dựa mãi vào anchor trong trang tổng.
4. Consolidate các file `ui-review-*`, `production-upgrade-*`, `phase2-*` thành design system/runtime sạch sau khi nghiệm thu UI.
5. Thay dần ảnh Unsplash/nguồn ngoài bằng media library chính thức VAS.
6. Chạy browser regression thật trên Chrome/Safari/Edge + iOS/Android sau khi GitHub Pages deploy commit mới.

## Tiêu chí hoàn tất
- Không còn item menu cấp 2 nào trỏ vô nghĩa về cùng trang cha nếu có section tương ứng.
- Search mở bằng click và phím `/`, đóng bằng Escape, hỗ trợ focus rõ.
- Form không báo “đã gửi” khi chưa có endpoint.
- Học phí không giả lập số liệu.
- Không còn copy như “redesign”, “preview data”, “section này…”, “cần kết nối…” trong nội dung public-facing.
