# Co-so map fix notes

## Asset review

Image search returned several public map references. The 640×400 codiemaps image (`/home/ubuntu/upload/search_images/r77kYe3sDixG.jpg`) is the closest visual fit for the requested map: it shows the older urban district layout with named districts including Go Vap, Thu Duc, Phu Nhuan, Binh Thanh, District 7, District 10 and District 12, plus road/river context. The 1111×862 administrative map (`/home/ubuntu/upload/search_images/0anoJueuQVuo.png`) is sharper but reflects a broader/newer administrative boundary view and is less useful for the six-campus urban finder. Use the urban district map as the visual reference, with an editorial overlay and the six interactive campus markers preserved above it.

## Existing bug hypothesis

All six marker buttons exist in the markup and are wired through `document.querySelectorAll('[data-campus]')`. Markers 04/05/06 appear visually but can be blocked or difficult to hit because map decorations and the caption share the same stacking context, while `.map-marker` has no explicit z-index. The fix should give the marker layer/markers a positive z-index, set pointer-events only on actionable markers, and keep decorative roads/labels non-interactive. Map markers must remain keyboard reachable.
## Preview smoke test

Preview at `https://4178-ilx2iquflulobomgixahp-bfd4cbc5.sg1.manus.computer/co-so/#ban-do` renders the district map image and the right detail panel in `var(--vas-red)`. The first visible interaction list initially showed 01 and 03 because the map was only partially inside the viewport; after scrolling, all six marker buttons appeared in the browser interaction list. Clicking marker 04 successfully changed the detail panel to Cơ sở 04 · Quận 7 / Sunrise, confirming the marker event delegation and the red card render.
## Final marker test

Clicking marker 05 changed the panel to Cơ sở 05 · Phú Nhuận / Hoàng Văn Thụ. Clicking marker 06 changed the panel to Cơ sở 06 · Quận 10 / Ba Tháng Hai. The browser interaction list exposed all six buttons 01–06 after the map entered the viewport, so the former 04/05/06 issue is resolved.

## Asset source record

Asset used: `/home/ubuntu/upload/search_images/r77kYe3sDixG.jpg`, copied into `assets/ho-chi-minh-district-map.jpg` and `site/assets/ho-chi-minh-district-map.jpg`. Image-search result title: “District Map of Ho Chi Minh City | codiemaps”; search query family: “Ho Chi Minh City district map labeled”, “Ho Chi Minh City map districts SVG”, “Bản đồ các quận Thành phố Hồ Chí Minh”. The search result did not expose a direct source URL, so the repository keeps the downloaded copy locally rather than depending on a remote host.
