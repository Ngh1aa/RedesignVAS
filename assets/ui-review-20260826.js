/* UI Feedback review · 2026-08-26 */
(function initVasUiReview() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  function patchAboutPage() {
    if (!/\/ve-vas(?:\/|$)/.test(path)) return;

    const heroTitle = document.querySelector("main > .page-hero h1");
    if (heroTitle) heroTitle.innerHTML = '20+ năm dẫn đầu <span class="italic">giáo dục song ngữ.</span>';

    const storyImage = document.querySelector("main > section:nth-of-type(2) .media.tall img");
    if (storyImage) {
      const sources = [
        "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG",
        "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/0A9A9302%20(1).jpg",
        "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/secondary.jpg",
      ];
      let index = 0;
      storyImage.src = sources[index];
      storyImage.alt = "Học sinh VAS trong môi trường học tập và trải nghiệm";
      storyImage.loading = "lazy";
      storyImage.addEventListener("error", () => {
        index += 1;
        if (index < sources.length) storyImage.src = sources[index];
      });
    }
  }

  function start() {
    patchAboutPage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
