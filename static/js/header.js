document.addEventListener("DOMContentLoaded", function() {
  const icons = [
    {el: document.querySelector('.home-icon'), unhover: 'home_unhover.svg', hover: 'home_hover.svg'},
    {el: document.querySelector('.search-icon'), unhover: 'search_unhover.svg', hover: 'search_hover.svg'},
    {el: document.querySelector('.mic-icon'), unhover: 'mic_unhover.svg', hover: 'mic_hover.svg'}
  ];

  icons.forEach(iconObj => {
    const el = iconObj.el;
    const img = el.querySelector('img');

    if (!el || !img) return;

    // Build full static paths
    const staticUrl = img.src.substring(0, img.src.lastIndexOf('/') + 1);
    const unhoverSrc = staticUrl + iconObj.unhover;
    const hoverSrc = staticUrl + iconObj.hover;

    // Hover swap
    el.addEventListener('mouseenter', () => {
      if (el.dataset.clicked === "false") img.src = hoverSrc;
    });

    el.addEventListener('mouseleave', () => {
      if (el.dataset.clicked === "false") img.src = unhoverSrc;
    });

    // Click swap & set active
    el.addEventListener('click', (e) => {
      e.preventDefault();

      // Reset all icons
      icons.forEach(i => {
        i.el.dataset.clicked = "false";
        i.el.classList.remove("active");
        const iImg = i.el.querySelector('img');
        iImg.src = staticUrl + i.unhover;
      });

      // Activate clicked icon
      el.dataset.clicked = "true";
      el.classList.add("active");
      img.src = hoverSrc;
    });
  });
});
