document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  let mobileMenu = document.querySelector(".mobile-menu");

  // Create dropdown dynamically if not exists
  if (!mobileMenu) {
    mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
      <a href="#">Premium</a>
      <a href="#">Support</a>
      <a href="#">Download</a>
      <a href="#">Install App</a>
      <a href="#">Sign up</a>
    `;
    document.body.appendChild(mobileMenu);
  }

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("active");
    }
  });
});
