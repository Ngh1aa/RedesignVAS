(function initVasDecisionContinuity() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function initHomeQuickActions() {
    if (document.body.dataset.page || $('.phase3-home-actions')) return;
    const hero = $('.hero');
    if (!hero) return;
    const section = document.createElement('section');
    section.className = 'phase3-home-actions';
    section.setAttribute('aria-label', 'Bắt đầu khám phá VAS');
    section.innerHTML = `<div class="wrap"><span class="phase3-home-actions-label">Bắt đầu từ nhu cầu của gia đình</span><div class="phase3-home-actions-grid"><a href="find-my-path/"><span>01</span><strong>Tìm lộ trình</strong><small>CEP · CAP · CAPI</small><i aria-hidden="true">→</i></a><a href="co-so/#tim-co-so"><span>02</span><strong>Tìm cơ sở</strong><small>6 cơ sở tại TP.HCM</small><i aria-hidden="true">→</i></a><a href="tuyen-sinh/#hoc-phi"><span>03</span><strong>Ước tính học phí</strong><small>Theo cấp · chương trình · cơ sở</small><i aria-hidden="true">→</i></a><a href="tuyen-sinh/?intent=visit#dang-ky"><span>04</span><strong>Tham quan VAS</strong><small>Chọn cơ sở và thời gian</small><i aria-hidden="true">→</i></a></div></div>`;
    hero.insertAdjacentElement('afterend', section);
  }

  function initProgrammeNextStep() {
    if (document.body.dataset.page !== 'Chương trình') return;
    const panel = $('#pathwayPanel');
    if (!panel || $('#phase3ProgrammeNext')) return;
    const next = document.createElement('div');
    next.id = 'phase3ProgrammeNext';
    next.className = 'phase3-programme-next';
    panel.insertAdjacentElement('afterend', next);

    const activeCode = () => $('.pathway-tab.active .pathway-tab-code')?.textContent.trim() || $('.pathway-code', panel)?.textContent.trim() || 'CEP';
    const render = () => {
      const code = activeCode().toUpperCase();
      next.innerHTML = `<div><span class="eyebrow">Bước tiếp theo</span><strong>Khám phá ${code} trong bối cảnh thực tế.</strong><p>Xem cơ sở có lộ trình này hoặc tiếp tục với đội ngũ tuyển sinh.</p></div><div class="phase3-programme-next-actions"><a class="btn btn-outline" href="../co-so/?program=${encodeURIComponent(code.toLowerCase())}#tim-co-so">Tìm cơ sở có ${code}</a><a class="btn btn-red" href="../tuyen-sinh/?intent=inquire&program=${encodeURIComponent(code.toLowerCase())}#dang-ky">Nhận tư vấn ${code}</a></div>`;
    };
    render();
    const tabs = $('#pathwayTabs');
    tabs?.addEventListener('click', () => requestAnimationFrame(render));
    new MutationObserver(render).observe(panel, { childList: true, subtree: true });
  }

  function boot() {
    initHomeQuickActions();
    initProgrammeNextStep();
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
