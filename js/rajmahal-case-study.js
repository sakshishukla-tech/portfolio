/* 
========================================================================
   RAJMAHAL CASE STUDY - Motion, cursor, scroll and reveal logic
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('case-loader');
    const nav = document.getElementById('case-nav');
    const scrollBar = document.getElementById('case-scroll-bar');
    const backToTop = document.getElementById('case-back-to-top');
    const cursor = document.getElementById('case-cursor');
    const cursorDot = document.getElementById('case-cursor-dot');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.addEventListener('load', () => {
        if (!loader) return;
        loader.classList.add('loaded');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 850);
    });

    setTimeout(() => {
        if (!loader || loader.classList.contains('loaded')) return;
        loader.classList.add('loaded');
    }, 2600);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function drawCursor() {
        cursorX += (mouseX - cursorX) * 0.16;
        cursorY += (mouseY - cursorY) * 0.16;

        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }

        requestAnimationFrame(drawCursor);
    }

    drawCursor();

    document.querySelectorAll('a, button, .research-card, .gallery-panel').forEach((element) => {
        element.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
        element.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
    });

    function updateScrollUi() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollBar) scrollBar.style.width = `${scrollPercent}%`;

        if (nav) {
            nav.classList.toggle('scrolled', scrollTop > 40);
        }

        if (backToTop) {
            backToTop.classList.toggle('visible', scrollTop > 720);
        }
    }

    window.addEventListener('scroll', updateScrollUi, { passive: true });
    updateScrollUi();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    document.querySelectorAll('.case-stat-card, .research-card, .process-timeline article, .dev-grid article, .motion-grid article, .lessons-grid article, .case-copy-stack, .gallery-panel').forEach((element) => {
        element.classList.add('reveal-on-scroll');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach((element) => revealObserver.observe(element));

    document.querySelectorAll('.case-back-link, .next-project-card, .case-scroll-cue').forEach((button) => {
        button.addEventListener('mousemove', (event) => {
            if (prefersReducedMotion) return;
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0px, 0px)';
        });
    });

    const hasGsap = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (!prefersReducedMotion && hasGsap) {
        if (hasScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.set('.case-hero-title, .case-kicker, .case-hero-subtitle, .case-hero-meta', {
            opacity: 0,
            y: 36
        });

        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .to('.case-hero-media', { scale: 1, duration: 1.8 })
            .to('.case-kicker', { opacity: 1, y: 0, duration: 0.8 }, '-=1.2')
            .to('.case-hero-title', { opacity: 1, y: 0, duration: 1.1 }, '-=0.55')
            .to('.case-hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
            .to('.case-hero-meta', { opacity: 1, y: 0, duration: 0.85 }, '-=0.45');

        if (hasScrollTrigger) {
            gsap.to('.case-hero-media', {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.case-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            document.querySelectorAll('[data-parallax]').forEach((element) => {
                const amount = Number(element.dataset.parallax) || 0.12;
                gsap.to(element, {
                    yPercent: amount * 100,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });

            const track = document.getElementById('gallery-track');
            const wrapper = document.querySelector('.gallery-track-wrapper');

            if (track && wrapper && window.innerWidth > 900) {
                const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

                gsap.to(track, {
                    x: () => -getDistance(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.gallery-section',
                        start: 'top top',
                        end: () => `+=${getDistance() + window.innerHeight}`,
                        scrub: 0.8,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });
            }

            gsap.utils.toArray('.case-dark-panel').forEach((panel) => {
                gsap.from(panel, {
                    opacity: 0.82,
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 75%',
                        end: 'top 35%',
                        scrub: true
                    }
                });
            });
        }
    } else {
        document.querySelectorAll('.case-hero-title, .case-kicker, .case-hero-subtitle, .case-hero-meta').forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 0.85,
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
});
