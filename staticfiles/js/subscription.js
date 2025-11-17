document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1 && document.querySelector(targetId)) {
        e.preventDefault();
        document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Optional: Animate elements on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".feature-card, .plan-card, .faq-grid details").forEach(el => {
    observer.observe(el);
  });
});
