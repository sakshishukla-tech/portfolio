/* 
========================================================================
   SCRIPT.JS - Interactive Core Logic, Animations & Contact Form Integrations
   Sakshi Shukla - Portfolio Website
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PAGE LOADER TERMINATION
    // ==========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    });
    // Fallback in case load event takes too long
    setTimeout(() => {
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
            setTimeout(() => { loader.style.display = 'none'; }, 800);
        }
    }, 3000);

    // ==========================================
    // 2. CUSTOM CURSOR TRACKING
    // ==========================================
    const cursorRing = document.getElementById('cursor-ring');
    const cursorDot = document.getElementById('cursor-dot');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant position for the dot
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Smooth Lerp for cursor ring
    function animateRing() {
        // Lerp equation: current = current + (target - current) * factor
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor interactions on hover
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .btn, .social-icon, .skill-item');
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (cursorRing) cursorRing.classList.add('hovered');
        });
        elem.addEventListener('mouseleave', () => {
            if (cursorRing) cursorRing.classList.remove('hovered');
        });
    });

    document.addEventListener('mousedown', () => {
        if (cursorRing) cursorRing.classList.add('clicked');
    });
    document.addEventListener('mouseup', () => {
        if (cursorRing) cursorRing.classList.remove('clicked');
    });

    // ==========================================
    // 3. SCROLL PROGRESS BAR & HEADER EFFECT
    // ==========================================
    const scrollBar = document.getElementById('scroll-bar');
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        if (scrollBar) {
            scrollBar.style.width = `${scrollPercent}%`;
        }

        // Navbar Scroll Class
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back To Top Visibility
        if (backToTopBtn) {
            if (scrollTop > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // Back to top scroll execution
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. RESPONSIVE HAMBURGER NAVIGATION
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !expanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on click of navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu on clicking outside the navbar
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 5. ACTIVE NAVBAR SECTION INDICATOR
    // ==========================================
    const sections = document.querySelectorAll('section[id]');

    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px' // Trigger active state when section covers center screen
    });

    sections.forEach(section => {
        activeSectionObserver.observe(section);
    });

    // ==========================================
    // 6. TYPED.JS IMPLEMENTATION
    // ==========================================
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['Frontend Developer', 'Graphic Designer', 'UI/UX Designer'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // ==========================================
    // 7. BACKGROUND PARTICLES CANVAS
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        // Resize Handler
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = 'rgba(132, 169, 140, ' + (Math.random() * 0.25 + 0.05) + ')';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Boundaries check
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();
        window.addEventListener('resize', initParticles);

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // 8. GLOW CARD COORDINATE UPDATE & MAGNETIC BUTTONS
    // ==========================================
    const glowCards = document.querySelectorAll('.glow-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .social-icon, .contact-social-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly towards cursor
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================
    // 9. GSAP HERO ANIMATIONS (INTRO EFFECTS)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        // Setup GSAP Timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

        tl.from('.navbar', { y: -50, opacity: 0, duration: 1.2 })
            .from('.hero-greeting', { y: 20, opacity: 0 }, '-=0.8')
            .from('.hero-title', { y: 30, opacity: 0, letterSpacing: '-5px' }, '-=0.7')
            .from('.hero-subtitle', { y: 20, opacity: 0 }, '-=0.7')
            .from('.hero-desc', { y: 20, opacity: 0 }, '-=0.6')
            .from('.hero-btns', { y: 25, opacity: 0 }, '-=0.6')
            .from('.hero-socials', { y: 15, opacity: 0 }, '-=0.5')
            .from('.profile-container', { scale: 0.85, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, '-=1.2')
            .from('.scroll-indicator', { y: -20, opacity: 0, repeat: -1, yoyo: true, duration: 1.5 }, '-=0.5');
    }

    // ==========================================
    // 10. AOS INITIALIZATION
    // ==========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 80
        });
    }

    // ==========================================
    // 11. EMAILJS CONTACT FORM INTEGRATION & VALIDATIONS
    // ==========================================

    /* 
    ========================================================================
       CRITICAL INFORMATION:
       To connect your production contact form to EmailJS:
       1. Sign up on https://dashboard.emailjs.com/
       2. Connect an Email Service (e.g. Gmail) to obtain your Service ID.
       3. Create an Email Template to obtain your Template ID.
       4. Retrieve your Public Key from Account settings.
       5. Put your Public Key in the init() function below.
       6. Put your Service ID & Template ID in the sendForm() call below.
    ======================================================================== 
    */

    // Initialize EmailJS with Public Key
    // USER ACTION REQUIRED: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    // ==========================================
    // EMAILJS CONTACT FORM
    // ==========================================

    // Initialize EmailJS
    if (typeof emailjs !== "undefined") {
        emailjs.init({
            publicKey: "WR55WvKLiBZ0QaN1F"
        });
    }

    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const submitText = submitBtn?.querySelector(".btn-text");
    const spinner = submitBtn?.querySelector(".spinner");

    const feedbackSuccess = document.getElementById("feedback-success");
    const feedbackError = document.getElementById("feedback-error");
    const errorText = document.getElementById("error-text");

    if (contactForm) {

        contactForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (feedbackSuccess) feedbackSuccess.style.display = "none";
            if (feedbackError) feedbackError.style.display = "none";

            const name = document.getElementById("form-name");
            const email = document.getElementById("form-email");
            const subject = document.getElementById("form-subject");
            const message = document.getElementById("form-message");

            if (name.value.trim() === "") {
                showError("Please enter your Full Name.");
                name.focus();
                return;
            }

            if (email.value.trim() === "") {
                showError("Please enter your Email Address.");
                email.focus();
                return;
            }

            if (!validateEmail(email.value.trim())) {
                showError("Please enter a valid Email Address.");
                email.focus();
                return;
            }

            if (subject.value.trim() === "") {
                showError("Please enter Subject.");
                subject.focus();
                return;
            }

            if (message.value.trim() === "") {
                showError("Please enter your Message.");
                message.focus();
                return;
            }

            setLoading(true);

            emailjs.sendForm(
                "service_aqibw5o",
                "template_x81tedj",
                contactForm
            )

                .then(function () {

                    setLoading(false);

                    feedbackSuccess.style.display = "flex";

                    contactForm.reset();

                })

                .catch(function (error) {

                    console.error(error);

                    setLoading(false);

                    showError("Failed to send email. Please try again.");

                });

        });

    }

    // ==========================
    // Helper Functions
    // ==========================

    function validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }

    function setLoading(loading) {

    if (!submitBtn) return;

    submitBtn.disabled = loading;

    if (loading) {

        if (submitText) submitText.style.display = "none";
        if (spinner) spinner.style.display = "inline-block";

    } else {

        if (submitText) submitText.style.display = "inline-block";
        if (spinner) spinner.style.display = "none";

    }

}   // ✅ Ye missing tha

function showSuccess() {

    if (!feedbackSuccess) return;

    feedbackSuccess.style.display = "flex";

    setTimeout(() => {
        feedbackSuccess.style.display = "none";
    }, 5000);

}

function showError(message) {

    if (!feedbackError || !errorText) return;

    errorText.textContent = message;

    feedbackError.style.display = "flex";

    setTimeout(() => {
        feedbackError.style.display = "none";
    }, 5000);

}});