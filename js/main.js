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

    // --- Product Poll (upvote) ---
    const pollButton = document.getElementById('pollButton');
    const pollCountEl = document.getElementById('pollCount');

    const POLL_VOTED_KEY = 'teletool_poll_voted';
    const REMOTE_POLL_URL = '/api/poll';

    const setVoted = () => localStorage.setItem(POLL_VOTED_KEY, '1');
    const hasVoted = () => localStorage.getItem(POLL_VOTED_KEY) === '1';

    const updateUI = (count) => {
        if (pollCountEl) {
            if (hasVoted()) {
                pollCountEl.textContent = "Waitlist joined! ✨";
            } else {
                pollCountEl.textContent = `Join ${count} others`;
            }
        }
        if (pollButton) {
            pollButton.disabled = hasVoted();
            if (hasVoted()) {
                pollButton.innerHTML = '<i class="bi bi-check-circle-fill mr-2"></i> You\'re on the list';
            }
        }
    };

    // Try to fetch remote count
    const initPoll = async () => {
        let count = 0; // Default seed
        try {
            const res = await fetch(REMOTE_POLL_URL, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.count === 'number') {
                    count = data.count;
                }
            }
        } catch (e) {
            console.warn('Waitlist API fallback:', e);
        }
        updateUI(count);
    };

    const sendVote = async () => {
        setVoted();
        updateUI("..."); // Loading state

        // Show feedback immediately
        alert("Thanks for your interest! We'll notify you as soon as we launch.");

        try {
            const res = await fetch(REMOTE_POLL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'vote' })
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.count === 'number') {
                    updateUI(data.count);
                    return;
                }
            }
        } catch (e) {
            console.error('Vote submission failed:', e);
        }
        updateUI(0); // Fallback if post fails but alert was shown
    };

    if (pollButton) {
        pollButton.addEventListener('click', () => {
            if (hasVoted()) return;
            sendVote();
        });
    }

    initPoll();
});
