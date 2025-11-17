// static/js/auth.js
document.addEventListener("DOMContentLoaded", function () {
    // -------------------- Input Error Handling --------------------
    const inputs = document.querySelectorAll(".question");

    inputs.forEach((input) => {
        const error = input.parentElement.querySelector(".input-error");

        if (error) {
            // Hide error when user starts typing again
            input.addEventListener("input", function () {
                error.style.display = "none";
            });

            // Show error when field loses focus and is empty
            input.addEventListener("blur", function () {
                if (input.value.trim() === "") {
                    error.style.display = "block";
                }
            });
        }
    });

    // -------------------- Consent Popup Handling --------------------
    window.openConsentPopup = function(event) {
        event.preventDefault();
        const popup = document.getElementById('consent-popup');
        if (popup) popup.style.display = 'block';
    };

    window.closeConsentPopup = function() {
        const popup = document.getElementById('consent-popup');
        if (popup) popup.style.display = 'none';
    };

    // Optional: close popup if clicked outside
    window.addEventListener('click', function(e) {
        const popup = document.getElementById('consent-popup');
        if (popup && popup.style.display === 'block' && !popup.contains(e.target)) {
            popup.style.display = 'none';
        }
    });
});


document.querySelectorAll('.checkbox-wrapper').forEach(row => {
    const checkbox = row.querySelector('.hidden-checkbox');
    const circle = row.querySelector('.checkmark-circle');

    row.addEventListener('click', (e) => {
        // Don't toggle if clicking the link
        if (e.target.tagName.toLowerCase() === 'a') return;

        // Toggle checkbox state
        checkbox.checked = !checkbox.checked;

        // Update circle styles
        if (checkbox.checked) {
            circle.textContent = '✓';
            circle.style.color = '#fff';
            circle.style.backgroundColor = '#0072c6';
        } else {
            circle.textContent = '';
            circle.style.color = '';
            circle.style.backgroundColor = '#1a1a1a';
        }
    });
});
