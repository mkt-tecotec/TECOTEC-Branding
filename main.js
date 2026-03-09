/**
 * TECOTEC Brand Playbook - Main JavaScript
 * Version 2.0 — tecotec-mkt
 * Handles TOC interactions, scroll spy, mobile menu, reading progress,
 * click-to-copy colors, fade-in animations, and other interactive features
 */

(function() {
    'use strict';

    // ===================================
    // Variables & Elements
    // ===================================

    const toc = document.getElementById('toc');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.content-section');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const backToTop = document.getElementById('backToTop');
    const readingProgress = document.getElementById('readingProgress');
    const copyTooltip = document.getElementById('copyTooltip');

    let currentSection = '';

    // ===================================
    // Smooth Scroll to Section
    // ===================================

    function smoothScrollToSection(event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            closeMobileMenu();

            const offset = 20;
            const targetPosition = targetSection.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            updateActiveLink(targetId);
        }
    }

    // ===================================
    // Update Active TOC Link
    // ===================================

    function updateActiveLink(targetId) {
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ===================================
    // Scroll Spy - Detect Current Section
    // ===================================

    function scrollSpy() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    updateActiveLink(sectionId);
                }
            }
        });
    }

    // ===================================
    // Reading Progress Bar (NEW)
    // ===================================

    function updateReadingProgress() {
        if (!readingProgress) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        readingProgress.style.width = Math.min(progress, 100) + '%';
    }

    // ===================================
    // Mobile Menu Toggle
    // ===================================

    function toggleMobileMenu() {
        toc.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        if (toc.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        toc.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===================================
    // Back to Top Button
    // ===================================

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    function scrollToTop(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===================================
    // Click-to-Copy Color HEX (NEW)
    // ===================================

    function initClickToCopy() {
        const colorHexElements = document.querySelectorAll('.color-hex[data-hex]');

        colorHexElements.forEach(el => {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                const hex = this.getAttribute('data-hex');

                navigator.clipboard.writeText(hex).then(() => {
                    showCopyTooltip(this, hex + ' copied!');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = hex;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopyTooltip(this, hex + ' copied!');
                });
            });
        });
    }

    function showCopyTooltip(element, text) {
        if (!copyTooltip) return;

        const rect = element.getBoundingClientRect();
        copyTooltip.textContent = text;
        copyTooltip.style.left = rect.left + (rect.width / 2) - 50 + 'px';
        copyTooltip.style.top = rect.top - 40 + 'px';
        copyTooltip.classList.add('show');

        setTimeout(() => {
            copyTooltip.classList.remove('show');
        }, 1500);
    }

    // ===================================
    // Throttle Function (Performance Optimization)
    // ===================================

    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;

        return function(...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime < delay) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    lastExecTime = currentTime;
                    func.apply(this, args);
                }, delay);
            } else {
                lastExecTime = currentTime;
                func.apply(this, args);
            }
        };
    }

    // ===================================
    // Debounce Function (Performance Optimization)
    // ===================================

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // ===================================
    // Handle Scroll Event
    // ===================================

    const handleScroll = throttle(function() {
        scrollSpy();
        toggleBackToTopButton();
        updateReadingProgress();
    }, 50);

    // ===================================
    // Handle Resize Event
    // ===================================

    const handleResize = debounce(function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250);

    // ===================================
    // Initialize Event Listeners
    // ===================================

    function initEventListeners() {
        tocLinks.forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }

        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && toc.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ===================================
    // Initialize Scroll Spy on Load
    // ===================================

    function initScrollSpy() {
        scrollSpy();
        toggleBackToTopButton();
        updateReadingProgress();
    }

    // ===================================
    // Handle Hash Navigation
    // ===================================

    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                setTimeout(() => {
                    const offset = 20;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    updateActiveLink(hash);
                }, 100);
            }
        }
    }

    // ===================================
    // Intersection Observer for Fade-in Animation (ENABLED)
    // ===================================

    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -5% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // ===================================
    // Add Print Styles Handler
    // ===================================

    function handlePrint() {
        window.addEventListener('beforeprint', () => {
            // Make all sections visible for print
            sections.forEach(section => {
                section.classList.add('fade-in');
            });
        });
    }

    // ===================================
    // Initialize App
    // ===================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startApp);
        } else {
            startApp();
        }
    }

    function startApp() {
        initEventListeners();
        initScrollSpy();
        handleHashNavigation();
        handlePrint();
        initIntersectionObserver();
        initClickToCopy();
    }

    // ===================================
    // Run Initialization
    // ===================================

    init();

    // ===================================
    // Expose Public API
    // ===================================

    window.TecotecPlaybook = {
        scrollToSection: function(sectionId) {
            const targetSection = document.querySelector(sectionId);
            if (targetSection) {
                const offset = 20;
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                updateActiveLink(sectionId);
            }
        },
        closeMobileMenu: closeMobileMenu,
        updateActiveLink: updateActiveLink
    };

})();
