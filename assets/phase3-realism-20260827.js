(function initVasPhase3Realism() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scriptSrc = document.currentScript?.src || '';

  function loadDecisionLayer() {
    if (!scriptSrc || document.querySelector('[data-vas-phase3-decisions]')) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('phase3-decisions-20260827.css?v=20260827a', scriptSrc).href;
    css.dataset.vasPhase3Decisions = 'true';
    document.head.appendChild(css);

    const js = document.createElement('script');
    js.src = new URL('phase3-decisions-20260827.js?v=20260827a', scriptSrc).href;
    js.defer = true;
    js.dataset.vasPhase3Decisions = 'true';
    document.head.appendChild(js);
  }

  function polishFeeCopy() {
    const note = $('#feeNote');
    if (!note) return;
    if (/prototype UI\/UX|minh họa/i.test(note.textContent)) {
      const schoolYear = window.VAS_DECISION_DATA?.tuition?.schoolYear || '2026–2027';
      note.textContent = `Mức ước tính tham khảo · ${schoolYear}. Biểu phí thực tế có thể thay đổi theo chính sách và lựa chọn của gia đình.`;
    }
  }

  function polishAdmissionsSuccess() {
    const msg = $('#formMsg');
    if (!msg || msg.hidden) return;
    const meter = $('.phase3-form-meter');
    if (meter) meter.hidden = true;
    $$('span', msg).forEach((span) => {
      span.innerHTML = span.innerHTML
        .replace('Thông tin đã được ghi nhận trong phiên trải nghiệm.', 'Thông tin đã được ghi nhận. Đội ngũ tuyển sinh sẽ liên hệ để xác nhận bước tiếp theo.')
        .replace(/prototype/gi, 'trực tuyến');
    });
  }

  function polishStoryDialog() {
    const dialog = $('#phase3StoryDialog');
    if (!dialog || dialog.hidden) return;
    $$('p', dialog).forEach((paragraph) => {
      if (/Trong prototype/i.test(paragraph.textContent)) {
        paragraph.textContent = 'Khám phá thêm những dấu ấn học tập, hoạt động và câu chuyện đang diễn ra trong cộng đồng VAS.';
      }
    });
  }

  function boot() {
    polishFeeCopy();
    const fee = $('#feeCalculator');
    if (fee) {
      fee.addEventListener('change', () => setTimeout(polishFeeCopy, 0));
      new MutationObserver(polishFeeCopy).observe($('#feeNote'), { childList: true, characterData: true, subtree: true });
    }

    const formMsg = $('#formMsg');
    if (formMsg) new MutationObserver(polishAdmissionsSuccess).observe(formMsg, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

    const storyDialog = $('#phase3StoryDialog');
    if (storyDialog) new MutationObserver(polishStoryDialog).observe(storyDialog, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  loadDecisionLayer();
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
