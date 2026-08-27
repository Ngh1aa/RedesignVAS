(function initPhase4BrandImagery() {
  const page = document.body.dataset.page || 'Trang chủ';
  const hero = document.querySelector(page === 'Trang chủ' ? '.hero > img' : '.page-hero > img');
  const heroes = {
    'Trang chủ': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/TAM09998%20(1)%201.jpg',
    'Về VAS': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/4sPv3WIwjv49hacsY9hz6i4kAy3Ht22tUvByhKlH.jpeg',
    'Chương trình': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/3fc139c1-e71a-4077-94b7-0ea09ed2cfd4.jpeg',
    'Các cơ sở': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSC06094.jpg',
    'Tuyển sinh': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/phu-huynh-ke-gi-ve-hanh-trinh-hoc-tap-cua-con-tai-vas.jpg',
    'Tin tức': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg',
    'Vòng quanh VAS': 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/2Rss8Y19k1HSYe2nN478uJTay6qCwc4CtWxjyNbz.jpeg'
  };

  if (hero && heroes[page]) {
    hero.src = heroes[page];
    hero.removeAttribute('srcset');
    hero.fetchPriority = 'high';
    hero.decoding = 'async';
  }

  if (page === 'Trang chủ') {
    const outcome = document.querySelector('.outcomes > img');
    if (outcome) {
      outcome.src = 'https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg';
      outcome.alt = 'Học sinh VAS trong lễ vinh danh thành tích Cambridge';
      outcome.loading = 'lazy';
      outcome.decoding = 'async';
    }
  }
})();
