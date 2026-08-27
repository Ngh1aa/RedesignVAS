(function initPhase4BrandImagery() {
  const page = document.body.dataset.page || 'Trang chủ';
  const hero = document.querySelector(page === 'Trang chủ' ? '.hero > img' : '.page-hero > img');
  const heroes = {
    'Trang chủ': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/TAM09998%20(1)%201.jpg',
      alt: 'Học sinh VAS trong môi trường học tập và trải nghiệm'
    },
    'Về VAS': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/4sPv3WIwjv49hacsY9hz6i4kAy3Ht22tUvByhKlH.jpeg',
      alt: 'Cộng đồng học sinh tại Trường Quốc tế Việt Úc VAS'
    },
    'Chương trình': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/3fc139c1-e71a-4077-94b7-0ea09ed2cfd4.jpeg',
      alt: 'Học sinh VAS học tập trong lớp học'
    },
    'Các cơ sở': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSC06094.jpg',
      alt: 'Không gian cơ sở Trường Quốc tế Việt Úc VAS'
    },
    'Tuyển sinh': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/phu-huynh-ke-gi-ve-hanh-trinh-hoc-tap-cua-con-tai-vas.jpg',
      alt: 'Phụ huynh và học sinh trong hành trình học tập tại VAS'
    },
    'Tin tức': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg',
      alt: 'Học sinh VAS tại hoạt động vinh danh thành tích Cambridge'
    },
    'Vòng quanh VAS': {
      src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/2Rss8Y19k1HSYe2nN478uJTay6qCwc4CtWxjyNbz.jpeg',
      alt: 'Đời sống và hoạt động học sinh tại VAS'
    }
  };

  const safeSwap = (image, next) => {
    if (!image || !next?.src) return;
    const fallback = image.currentSrc || image.src;
    const preload = new Image();
    preload.decoding = 'async';
    preload.onload = () => {
      image.classList.add('phase45-brand-image-loading');
      image.src = next.src;
      image.removeAttribute('srcset');
      image.alt = next.alt || image.alt;
      image.fetchPriority = 'high';
      image.decoding = 'async';
      requestAnimationFrame(() => image.classList.remove('phase45-brand-image-loading'));
    };
    preload.onerror = () => {
      if (fallback) image.src = fallback;
    };
    preload.src = next.src;
  };

  safeSwap(hero, heroes[page]);

  if (page === 'Trang chủ') {
    const outcome = document.querySelector('.outcomes > img');
    if (outcome) {
      const next = {
        src: 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg',
        alt: 'Học sinh VAS trong lễ vinh danh thành tích Cambridge'
      };
      const preload = new Image();
      preload.onload = () => {
        outcome.src = next.src;
        outcome.alt = next.alt;
        outcome.loading = 'lazy';
        outcome.decoding = 'async';
      };
      preload.src = next.src;
    }
  }
})();
