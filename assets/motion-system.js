(function initVasMotionSystem() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionScriptSrc = document.currentScript?.src || "";
  const itemSelector = [
    "main > section",
    "main article",
    "main [class$='-card']",
    "main [class*='-card ']",
    "main [class$='-tile']",
    "main [class*='-tile ']",
    "main figure",
    "main [class$='-media']",
    "main [class*='-media ']",
  ].join(",");
  const mediaSelector = "main figure, main [class$='-media'], main [class*='-media ']";
  let observer;

  document.documentElement.classList.add("vas-motion-ready");

  function prepare(scope) {
    const queryRoot = scope || document;
    const nodes = [
      ...(queryRoot instanceof Element && queryRoot.matches(itemSelector) ? [queryRoot] : []),
      ...queryRoot.querySelectorAll(itemSelector),
    ];

    nodes.forEach((node) => {
      if (node.dataset.vasMotionReady === "true" || node.closest("[data-no-motion]")) return;
      node.dataset.vasMotionReady = "true";
      node.classList.add("vas-motion-item");
      if (node.matches(mediaSelector)) node.classList.add("vas-motion-media");

      const siblings = [...node.parentElement.children].filter((child) => child.matches?.(itemSelector));
      const index = Math.max(0, siblings.indexOf(node));
      node.style.setProperty("--vas-motion-delay", `${Math.min(index, 4) * 65}ms`);

      const firstSection = node.matches("main > section:first-of-type");
      if (firstSection || reducedMotion || !observer) node.classList.add("is-motion-visible");
      else observer.observe(node);
    });
  }

  if (!reducedMotion && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-motion-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -7% 0px" });
  }

  function start() {
    prepare(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) prepare(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });
  }

  if (motionScriptSrc) {
    const assetUrl = (file, version) => new URL(`${file}?v=${version}`, motionScriptSrc).href;
    const addCss = (file, version, key) => {
      if (document.querySelector(`link[data-vas-asset="${key}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = assetUrl(file, version);
      link.dataset.vasAsset = key;
      document.head.appendChild(link);
    };
    const addJs = (file, version, key) => {
      if (document.querySelector(`script[data-vas-asset="${key}"]`)) return;
      const script = document.createElement("script");
      script.src = assetUrl(file, version);
      script.async = false;
      script.defer = true;
      script.dataset.vasAsset = key;
      document.head.appendChild(script);
    };

    [
      ["typography-safety.css", "20260826", "typography-safety"],
      ["about-hero-seamless.css", "20260826b", "about-hero-seamless"],
      ["ui-review-20260826.css", "20260826a", "ui-review"],
      ["uivas-review-20260826.css", "20260826b", "latest-ui-review"],
      ["campus-card-equal.css", "20260826c", "campus-card-equal"],
      ["production-upgrade-20260827.css", "20260827b", "production-upgrade-css"],
      ["phase2-ux-20260827.css", "20260827c", "phase2-ux-css"],
      ["phase3-interactions-20260827.css", "20260827a", "phase3-interactions-css"],
      ["phase3-decisions-20260827.css", "20260827a", "phase3-decisions-css"],
      ["phase4-visual-system-20260827.css", "20260827a", "phase4-visual-system-css"],
      ["phase4-page-fixes-20260827.css", "20260827a", "phase4-page-fixes-css"],
      ["phase4-flow-fixes-20260827.css", "20260827a", "phase4-flow-fixes-css"],
      ["phase45-final-qa-20260827.css", "20260827a", "phase45-final-qa-css"],
    ].forEach(([file, version, key]) => addCss(file, version, key));

    [
      ["vas-content-upgrades.js", "20260826", "content-upgrades"],
      ["vas-hero-campus-ui.js", "20260826", "hero-campus-ui"],
      ["ui-review-20260826.js", "20260826a", "ui-review-js"],
      ["production-upgrade-20260827.js", "20260827c", "production-upgrade-js"],
      ["phase2-ux-20260827.js", "20260827c", "phase2-ux-js"],
      ["phase3-interactions-20260827.js", "20260827a", "phase3-interactions-js"],
      ["phase3-decisions-20260827.js", "20260827a", "phase3-decisions-js"],
      ["phase3-realism-20260827.js", "20260827a", "phase3-realism-js"],
      ["phase4-brand-imagery-20260827.js", "20260827b", "phase4-brand-imagery-js"],
      ["phase4-ux-qa-20260827.js", "20260827a", "phase4-ux-qa-js"],
      ["phase45-final-qa-20260827.js", "20260827b", "phase45-final-qa-js"],
    ].forEach(([file, version, key]) => addJs(file, version, key));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
