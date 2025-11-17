document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const authButtons = document.querySelector(".auth-buttons");

  // Navbar scroll blur & shadow
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      authButtons.classList.toggle("active");
      menuToggle.classList.toggle("open");
    });
  }
});
