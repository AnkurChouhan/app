// script.js

// Example: Toggle active sidebar item
const sidebarLinks = document.querySelectorAll('aside ul li a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
        this.parentElement.classList.add('active');
    });
});

// You can also add more scripts like modals, alerts, etc.
