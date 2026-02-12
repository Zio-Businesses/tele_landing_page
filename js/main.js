document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Logic ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileMenu = (active) => {
        mobileNav.classList.toggle('active', active);
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    mobileMenuToggle.addEventListener('click', () => toggleMobileMenu(true));
    closeMenu.addEventListener('click', () => toggleMobileMenu(false));

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // --- Scroll Reveal Logic ---
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const delay = el.getAttribute('data-delay') || 0;

            if (elTop < triggerBottom) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // --- Dynamic Navbar Background ---
    const appBar = document.querySelector('.app-bar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            appBar.style.boxShadow = 'var(--elevation-2)';
            appBar.style.height = '70px';
        } else {
            appBar.style.boxShadow = 'none';
            appBar.style.height = '80px';
        }
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Console Greeting ---
    console.log('%c TeleTool Landing Page Built with Material Design 3', 'background: #4F46E5; color: #fff; padding: 4px 8px; border-radius: 4px;');
});
