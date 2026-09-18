/* VAS extended experience-page interactions */
(function () {
  const $all = (s, root=document) => [...root.querySelectorAll(s)];

  const scholarshipButtons = $all('[data-scholarship-tab]');
  if (scholarshipButtons.length) {
    const panels = $all('[data-scholarship-panel]');
    scholarshipButtons.forEach((btn) => btn.addEventListener('click', () => {
      scholarshipButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => p.hidden = p.dataset.scholarshipPanel !== btn.dataset.scholarshipTab);
    }));
  }

  const guidanceButtons = $all('[data-guidance-choice]');
  const guidanceTitle = document.querySelector('[data-guidance-title]');
  const guidanceCopy = document.querySelector('[data-guidance-copy]');
  const guidanceTag = document.querySelector('[data-guidance-tag]');
  const guidanceData = {
    discover: ['Khám phá bản thân trước khi chọn ngành.', 'Bắt đầu từ sở thích, điểm mạnh và thiên hướng nghề nghiệp; sau đó biến chúng thành câu hỏi để trao đổi cùng chuyên gia tư vấn.', 'Khám phá'],
    compare: ['So sánh lựa chọn bằng tiêu chí rõ ràng.', 'Đặt ngành học, môi trường đại học, quốc gia và lộ trình tài chính cạnh nhau để ra quyết định có cơ sở hơn.', 'So sánh'],
    apply: ['Biến mục tiêu thành một kế hoạch hồ sơ.', 'Xây timeline cho chứng chỉ, hoạt động, shortlist trường, học bổng và các mốc nộp hồ sơ quan trọng.', 'Lập kế hoạch']
  };
  guidanceButtons.forEach((btn) => btn.addEventListener('click', () => {
    guidanceButtons.forEach((b) => b.classList.toggle('active', b === btn));
    const data = guidanceData[btn.dataset.guidanceChoice];
    if (!data) return;
    if (guidanceTitle) guidanceTitle.textContent = data[0];
    if (guidanceCopy) guidanceCopy.textContent = data[1];
    if (guidanceTag) guidanceTag.textContent = data[2];
  }));

  const jobFilters = $all('[data-job-filter]');
  const jobs = $all('[data-job-role]');
  jobFilters.forEach((btn) => btn.addEventListener('click', () => {
    jobFilters.forEach((b) => b.classList.toggle('active', b === btn));
    const filter = btn.dataset.jobFilter;
    jobs.forEach((job) => job.hidden = filter !== 'all' && job.dataset.jobRole !== filter);
  }));

  const reasonButtons = $all('[data-contact-reason]');
  const contactTitle = document.querySelector('[data-contact-title]');
  const contactCopy = document.querySelector('[data-contact-copy]');
  const contactLines = document.querySelector('[data-contact-lines]');
  const contactMap = {
    admissions: {title:'Tư vấn tuyển sinh',copy:'Phù hợp khi gia đình cần tư vấn cấp học, chương trình, học phí hoặc quy trình dự tuyển.',lines:'<a href="tel:0911267755">Hotline 0911 267 755</a><a href="../tuyen-sinh/?intent=inquire#dang-ky">Mở form tư vấn →</a>'},
    visit: {title:'Tham quan cơ sở',copy:'Chọn cơ sở và gửi khung thời gian mong muốn. Trang đặt lịch sẽ giúp gia đình chuẩn bị trước chuyến tham quan.',lines:'<a href="../dat-lich-tham-quan/">Đặt lịch tham quan →</a><a href="../co-so/">Khám phá 6 cơ sở →</a>'},
    career: {title:'Cơ hội nghề nghiệp',copy:'Dành cho giáo viên và nhân sự muốn tìm hiểu các vị trí đang tuyển tại VAS.',lines:'<a href="../tuyen-dung/">Xem tuyển dụng →</a><a href="mailto:tuyendung.vas@vas.edu.vn">tuyendung.vas@vas.edu.vn</a>'},
    general: {title:'Thông tin chung',copy:'Các câu hỏi khác về VAS có thể được chuyển đến đội ngũ phù hợp từ đầu mối thông tin chung.',lines:'<a href="tel:0911267755">0911 267 755</a><a href="mailto:info@vas.edu.vn">info@vas.edu.vn</a>'}
  };
  reasonButtons.forEach((btn) => btn.addEventListener('click', () => {
    reasonButtons.forEach((b) => b.classList.toggle('active', b === btn));
    const data = contactMap[btn.dataset.contactReason];
    if (!data) return;
    if (contactTitle) contactTitle.textContent = data.title;
    if (contactCopy) contactCopy.textContent = data.copy;
    if (contactLines) contactLines.innerHTML = data.lines;
  }));

  const visitParams = new URLSearchParams(window.location.search);
  const slugify = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const programmeLabels = { cep: "CEP", cap: "CAP", capi: "CAPI" };
  const levelLabels = { "mam-non": "Mầm non", "tieu-hoc": "Tiểu học", thcs: "THCS", thpt: "THPT" };

  const campusChoices = $all('[data-campus-choice]');
  const visitCampusInput = document.querySelector('[name="visitCampus"]');
  const visitProgramInput = document.querySelector('[name="visitProgram"]');
  const visitLevelInput = document.querySelector('[name="visitLevel"]');
  const visitSummaryCampus = document.querySelector('[data-summary-campus]');
  const visitSummaryProgram = document.querySelector('[data-summary-program]');
  const visitSummaryLevel = document.querySelector('[data-summary-level]');
  const visitContext = document.querySelector('[data-visit-context]');
  const contextProgram = document.querySelector('[data-context-program]');
  const contextLevel = document.querySelector('[data-context-level]');
  const contextSeparator = document.querySelector('[data-context-separator]');
  const visitSummaryDate = document.querySelector('[data-summary-date]');
  const visitSummaryTime = document.querySelector('[data-summary-time]');
  const visitSummaryFamily = document.querySelector('[data-summary-family]');
  campusChoices.forEach((btn) => btn.addEventListener('click', () => {
    campusChoices.forEach((b) => b.classList.toggle('active', b === btn));
    if (visitCampusInput) visitCampusInput.value = btn.dataset.campusChoice;
    if (visitSummaryCampus) visitSummaryCampus.textContent = btn.dataset.campusChoice;
  }));

  const requestedCampus = visitParams.get('campus');
  const requestedProgram = visitParams.get('program');
  const requestedLevel = visitParams.get('level');
  if (requestedCampus && campusChoices.length) {
    const requestedChoice = campusChoices.find((btn) => slugify(btn.dataset.campusChoice) === slugify(requestedCampus));
    if (requestedChoice) {
      campusChoices.forEach((btn) => btn.classList.toggle('active', btn === requestedChoice));
      if (visitCampusInput) visitCampusInput.value = requestedChoice.dataset.campusChoice;
      if (visitSummaryCampus) visitSummaryCampus.textContent = requestedChoice.dataset.campusChoice;
    }
  }
  if (visitProgramInput) visitProgramInput.value = requestedProgram || '';
  if (visitLevelInput) visitLevelInput.value = requestedLevel || '';
  if (visitSummaryProgram) visitSummaryProgram.textContent = programmeLabels[requestedProgram] || 'Chưa chọn';
  if (visitSummaryLevel) visitSummaryLevel.textContent = levelLabels[requestedLevel] || 'Chưa chọn';
  if (visitContext && (requestedProgram || requestedLevel)) {
    visitContext.hidden = false;
    if (contextProgram) contextProgram.textContent = requestedProgram ? `lộ trình ${programmeLabels[requestedProgram] || requestedProgram.toUpperCase()}` : 'lộ trình chưa xác định';
    if (contextLevel) contextLevel.textContent = requestedLevel ? `cấp ${levelLabels[requestedLevel] || requestedLevel}` : 'cấp học chưa xác định';
    if (contextSeparator) contextSeparator.hidden = !(requestedProgram && requestedLevel);
  }

  const dateInput = document.querySelector('[name="visitDate"]');
  const timeInput = document.querySelector('[name="visitTime"]');
  const familyInput = document.querySelector('[name="familyName"]');
  const syncVisit = () => {
    if (visitSummaryDate) visitSummaryDate.textContent = dateInput?.value || 'Chưa chọn';
    if (visitSummaryTime) visitSummaryTime.textContent = timeInput?.value || 'Linh hoạt';
    if (visitSummaryFamily) visitSummaryFamily.textContent = familyInput?.value || 'Gia đình của bạn';
  };
  [dateInput,timeInput,familyInput].filter(Boolean).forEach((el) => el.addEventListener('input', syncVisit));
  const visitForm = document.querySelector('[data-visit-form]');
  if (visitForm) {
    visitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submit = visitForm.querySelector('[type="submit"]');
      if (!submit) return;
      const original = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Đã ghi nhận mong muốn ✓';
      setTimeout(() => { submit.disabled = false; submit.textContent = original; }, 1800);
    });
  }
})();
