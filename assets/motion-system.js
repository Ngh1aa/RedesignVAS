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
    const typographySafety = document.createElement("link");
    typographySafety.rel = "stylesheet";
    typographySafety.href = new URL("typography-safety.css?v=20260826", motionScriptSrc).href;
    typographySafety.dataset.vasTypographySafety = "true";
    document.head.appendChild(typographySafety);

    const aboutHeroSeamless = document.createElement("link");
    aboutHeroSeamless.rel = "stylesheet";
    aboutHeroSeamless.href = new URL("about-hero-seamless.css?v=20260826b", motionScriptSrc).href;
    aboutHeroSeamless.dataset.vasAboutHeroSeamless = "true";
    document.head.appendChild(aboutHeroSeamless);

    const upgrade = document.createElement("script");
    upgrade.src = new URL("vas-content-upgrades.js?v=20260826", motionScriptSrc).href;
    upgrade.defer = true;
    upgrade.dataset.vasContentUpgrades = "true";
    document.head.appendChild(upgrade);

    const heroCampusUi = document.createElement("script");
    heroCampusUi.src = new URL("vas-hero-campus-ui.js?v=20260826", motionScriptSrc).href;
    heroCampusUi.defer = true;
    heroCampusUi.dataset.vasHeroCampusUi = "true";
    document.head.appendChild(heroCampusUi);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();