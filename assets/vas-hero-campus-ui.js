/* VAS official hero imagery + compact campus overview · 2026-08-26 */
(function initVasHeroCampusUI() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const scriptSrc = document.currentScript?.src || window.location.href;

  /* All hero sources below come from VAS official web properties / media storage. */
  const official = {
    home: {
      primary: "https://www.vas.edu.vn/asset/image/poster.webp",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
    },
    about: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/ve%20vas%201.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/Screenshot%202024-03-14%20172156.png",
    },
    programme: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/chuong-trinh-tieu-hoc-banner-1.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
    },
    campuses: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSC05807.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSC06094.jpg",
    },
    admissions: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/_DH_3950%201.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
    },
    news: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
    },
    around: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSCF1231.jpg",
    },
    findPath: {
      primary: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSCF1231.jpg",
      fallback: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/chuong-trinh-tieu-hoc-banner-1.jpg",
    },
  };

  function heroConfig() {
    if (/\/find-my-path(?:\/|$)/.test(path)) return official.findPath;
    if (/\/ve-vas(?:\/|$)/.test(path)) return official.about;
    if (/\/chuong-trinh(?:\/|$)/.test(path)) return official.programme;
    if (/\/co-so(?:\/|$)/.test(path)) return official.campuses;
    if (/\/tuyen-sinh(?:\/|$)/.test(path)) return official.admissions;
    if (/\/tin-tuc(?:\/|$)/.test(path)) return official.news;
    if (/\/vong-quanh-vas(?:\/|$)/.test(path)) return official.around;
    return official.home;
  }

  function patchHero() {
    const image = document.querySelector("main > .hero > img, main > .page-hero > img, .hero > img, .page-hero > img");
    if (!image) return;

    const config = heroConfig();
    const queue = [config.primary, config.fallback, official.home.primary].filter((url, index, arr) => url && arr.indexOf(url) === index);
    let sourceIndex = 0;

    image.loading = "eager";
    image.setAttribute("fetchpriority", "high");
    image.referrerPolicy = "no-referrer";
    image.dataset.vasOfficialSource = "true";

    const tryNext = () => {
      sourceIndex += 1;
      if (sourceIndex >= queue.length) return;
      image.src = queue[sourceIndex];
    };

    image.addEventListener("error", tryNext);
    image.src = queue[0];
  }

  function loadCampusCompactList() {
    if (!/\/co-so(?:\/|$)/.test(path)) return;
    if (document.querySelector("link[data-vas-campus-compact]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.dataset.vasCampusCompact = "true";
    link.href = new URL("../co-so/compact-campus-list.css?v=20260826", scriptSrc).href;
    document.head.appendChild(link);
  }

  function start() {
    patchHero();
    loadCampusCompactList();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
