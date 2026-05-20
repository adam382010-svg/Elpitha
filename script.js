/**
 * INTERACTIVE UX LOGIC - ΕΛΠΙΔΑ MODEL UNITED NATIONS (Ελπίδα MUN)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MOBILE DRAWER NAVIGATION
    // ==========================================================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        // Toggle Active Classes
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close Mobile Drawer when Link is Clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // 2. STICKY HEADER SCROLL SHAPE-SHIFT
    // ==========================================================================
    const header = document.querySelector('.main-header');
    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Shrink and deepen header glass when scrolled
        if (scrollPos > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.08)';
        } else {
            header.style.padding = '';
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
        }

        // Fade out Scroll Indicator Mouse in Hero
        if (scrollIndicator) {
            if (scrollPos > 150) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    });

    // ==========================================================================
    // 3. INTERSECTION OBSERVER FOR SCROLL-REVEAL SECTIONS & CARDS
    // ==========================================================================
    
    // Core Section Reveal Options
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Observer for Sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, no need to track again
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Track all reveal-configured sections
    const revealSections = document.querySelectorAll('.scroll-reveal');
    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Observer for Individual Executive Board Cards with Staggered Delays
    const cardObserver = new IntersectionObserver((entries, observer) => {
        // Group entries that appear in the viewport at the same time to apply a staggered delay
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        visibleEntries.forEach((entry, index) => {
            const card = entry.target;
            
            // Calculate a slight stagger delay (e.g. 80ms per index increment)
            const staggerDelay = index * 80;
            
            // Set inline styles for delayed transition execution
            card.style.transitionDelay = `${staggerDelay}ms`;
            
            // Add trigger class
            card.classList.add('revealed');
            
            // Stop observing card once activated
            observer.unobserve(card);
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    // Track all individual cards
    const boardCards = document.querySelectorAll('.scroll-reveal-card');
    boardCards.forEach(card => {
        cardObserver.observe(card);
    });

    // ==========================================================================
    // 4. ACTIVE NAVIGATION LINK SYNC ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const activeNavObserverOptions = {
        threshold: 0.5, // 50% of the section must be visible
        rootMargin: '-80px 0px -20% 0px' // Adjust for sticky header height
    };

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active classes from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeNavObserverOptions);

    // Observe each section for navigation link tracking
    sections.forEach(section => {
        activeNavObserver.observe(section);
    });

    // Smooth Scroll to Explore Indicator Click Trigger
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const missionSection = document.getElementById('mission');
            if (missionSection) {
                missionSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // 5. SUBTLE MOUSE-TRACKING GLOW EFFECT (GPU ACCELERATED)
    // ==========================================================================
    const mouseGlow = document.createElement('div');
    mouseGlow.className = 'mouse-glow';
    document.body.appendChild(mouseGlow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let hasMoved = false;

    // Track cursor coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!hasMoved) {
            hasMoved = true;
            mouseGlow.style.opacity = '1';
        }
    });

    // Handle cursor leaving and entering window
    document.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (hasMoved) {
            mouseGlow.style.opacity = '1';
        }
    });

    // 60FPS smooth lerp loop using requestAnimationFrame
    function animateGlow() {
        // High premium dampening physics (0.08 ease coefficient)
        const ease = 0.08;
        glowX += (mouseX - glowX) * ease;
        glowY += (mouseY - glowY) * ease;

        // Apply hardware-accelerated translate3d transforms
        mouseGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(animateGlow);
    }
    
    // Start animation loop
    animateGlow();
});
