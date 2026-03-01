// Menu burger toggle
function openmenu() {
    const burgerMenu = document.querySelector('.nav_menu_bergur');
    const btnBurger = document.querySelector('.btn-menu-burger');

    if (burgerMenu.style.display === 'none' || burgerMenu.style.display === '') {
        burgerMenu.style.display = 'block';
        btnBurger.textContent = 'X';
    } else {
        burgerMenu.style.display = 'none';
        btnBurger.textContent = '☰';
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const burgerMenu = document.querySelector('.nav_menu_bergur');
        const burgerBtn = document.querySelector('.btn-menu-burger');

        if (burgerMenu && burgerBtn) {
            if (!burgerMenu.contains(event.target) && !burgerBtn.contains(event.target)) {
                if (burgerMenu.style.display !== 'none') {
                    burgerMenu.style.display = 'none';
                    burgerBtn.textContent = '☰';
                }
            }
        }
    });
});
