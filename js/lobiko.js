(function () {
    'use strict';

    // Preloader — afficher le contenu dès que le DOM est prêt (sans attendre toutes les images)
    function hidePreloader() {
        var preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hidePreloader);
    } else {
        hidePreloader();
    }

    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3000);

    // Header scroll
    var header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Active nav link
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 120;
            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    var id = section.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        });
    }

    // Counter animation
    function formatCount(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    }

    var counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    var suffix = el.getAttribute('data-suffix') || '';
                    var duration = 1800;
                    var startTime = null;

                    function animate(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
                        var current = Math.floor(eased * target);
                        el.textContent = (target >= 1000 ? formatCount(current) : current) + suffix;
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    }

                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    // Reveal on scroll
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            var isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                openItem.classList.remove('open');
            });

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // Hero typewriter
    var typewriterEl = document.getElementById('heroTypewriter');
    if (typewriterEl) {
        var isEnglish = document.documentElement.lang === 'en';
        var phrases = isEnglish
            ? [
                'Protect your family',
                'Manage your medical expenses',
                'Access quality care quickly'
            ]
            : [
                'Protéger votre famille',
                'Maîtriser vos dépenses médicales',
                'Accéder rapidement à des soins de qualité'
            ];

        var phraseIndex = 0;
        var charIndex = 0;
        var phase = 'typing';

        function typewriterTick() {
            var current = phrases[phraseIndex];
            var delay;

            if (phase === 'typing') {
                charIndex++;
                typewriterEl.textContent = current.substring(0, charIndex);
                if (charIndex >= current.length) {
                    phase = 'pause';
                    delay = 2200;
                } else {
                    delay = 52;
                }
            } else if (phase === 'pause') {
                phase = 'deleting';
                delay = 0;
            } else {
                charIndex--;
                typewriterEl.textContent = current.substring(0, charIndex);
                if (charIndex <= 0) {
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    phase = 'typing';
                    delay = 450;
                } else {
                    delay = 28;
                }
            }

            setTimeout(typewriterTick, delay);
        }

        typewriterTick();
    }

    // Timeline — révélation progressive des étapes au scroll
    var processTimeline = document.querySelector('.process-timeline');
    if (processTimeline) {
        var timelineSteps = processTimeline.querySelectorAll('.process-step-card');
        var visualStrip = document.querySelector('.process-visual-strip');
        var stepDelay = 240;
        var hasRevealed = false;

        function revealTimeline() {
            if (hasRevealed) return;
            hasRevealed = true;

            processTimeline.classList.add('is-revealed');
            if (visualStrip) {
                visualStrip.classList.add('is-revealed');
            }

            timelineSteps.forEach(function (step, index) {
                setTimeout(function () {
                    step.classList.add('active');
                }, 180 + index * stepDelay);
            });
        }

        var timelineObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    revealTimeline();
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

        timelineObserver.observe(processTimeline);
    }

    // Slider témoignages
    var slider = document.getElementById('testimonialsSlider');
    if (slider) {
        var slides = slider.querySelectorAll('.testimonial-slide');
        var dotsContainer = slider.querySelector('.slider-dots');
        var prevBtn = slider.querySelector('.slider-prev');
        var nextBtn = slider.querySelector('.slider-next');
        var current = 0;
        var autoplayTimer;

        slides.forEach(function (_, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Témoignage ' + (index + 1));
            dot.addEventListener('click', function () {
                goTo(index);
            });
            dotsContainer.appendChild(dot);
        });

        var dots = dotsContainer.querySelectorAll('.slider-dot');

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
            resetAutoplay();
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(function () {
                goTo(current + 1);
            }, 6000);
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

        resetAutoplay();
    }
})();
