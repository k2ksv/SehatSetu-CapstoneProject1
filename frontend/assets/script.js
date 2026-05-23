// --- Sehat-Setu SPA Navigation & Login Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');
    const loginForm = document.getElementById('login-form');
    const loginStatus = document.getElementById('login-status');
    const homeLink = document.getElementById('home-link');
    const loginLink = document.getElementById('login-link');

    // Helper: Show only the selected section
    function showSection(sectionId) {
        sections.forEach(sec => {
            sec.style.display = (sec.id === sectionId) ? '' : 'none';
        });
        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Default: show Overview
    showSection('overview');

    // Simple login logic (demo only)
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Demo: any username/password logs in
            loginStatus.textContent = 'Login successful!';
            setTimeout(() => {
                // Hide Overview, show Home, hide Login link, show Home link
                showSection('home');
                homeLink.style.display = '';
                loginLink.style.display = 'none';
            }, 700);
        });
    }
});
        menuButton.setAttribute('aria-expanded', String(!isExpanded));
        navLinks.classList.toggle('is-open', !isExpanded);
    });
}