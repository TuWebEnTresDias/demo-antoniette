/* ============================================
   ANTOINETTE - RESTO BAR CLUB
   Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // ---- Header Scroll Effect ----
    const header = document.getElementById('header');
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ---- Mobile Menu ----
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = nav.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Scroll Animations ----
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ---- WhatsApp Form Submission ----
    const reservaForm = document.getElementById('reservaForm');
    
    if (reservaForm) {
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const fecha = document.getElementById('fecha').value;
            const personas = document.getElementById('personas').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            // Format date
            let fechaFormateada = '';
            if (fecha) {
                const fechaObj = new Date(fecha + 'T12:00:00');
                fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                });
            }
            
            // Build WhatsApp message
            let whatsappMessage = `Hola Antoniette! 👋\n\n`;
            whatsappMessage += `Quiero hacer una reserva:\n`;
            whatsappMessage += `📅 *Fecha:* ${fechaFormateada || 'A coordinar'}\n`;
            whatsappMessage += `👥 *Personas:* ${personas || 'A definir'}\n`;
            whatsappMessage += `👤 *Nombre:* ${nombre}\n`;
            
            if (mensaje) {
                whatsappMessage += `\n💬 *Mensaje:* ${mensaje}\n`;
            }
            
            whatsappMessage += `\n¡Gracias!`;
            
            // Encode message and open WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5491159136834?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // ---- Parallax Effect on Hero ----
    const heroImg = document.querySelector('.hero-img');
    
    if (heroImg) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxSpeed = 0.3;
                heroImg.style.transform = `scale(1.1) translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // ---- Gallery Lightbox Effect (Simple) ----
    const galeriaItems = document.querySelectorAll('.galeria-item');
    
    galeriaItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    cursor: pointer;
                    padding: 2rem;
                    animation: fadeIn 0.3s ease;
                `;
                
                const fullImg = document.createElement('img');
                fullImg.src = img.src;
                fullImg.alt = img.alt;
                fullImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                `;
                
                overlay.appendChild(fullImg);
                document.body.appendChild(overlay);
                document.body.style.overflow = 'hidden';
                
                // Close on click
                overlay.addEventListener('click', function() {
                    overlay.style.opacity = '0';
                    overlay.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        overlay.remove();
                        document.body.style.overflow = '';
                    }, 300);
                });
                
                // Close on escape
                const closeOnEscape = (e) => {
                    if (e.key === 'Escape') {
                        overlay.click();
                        document.removeEventListener('keydown', closeOnEscape);
                    }
                };
                document.addEventListener('keydown', closeOnEscape);
            }
        });
    });

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--color-accent-pink)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ---- Typing Effect for Hero Tagline (Optional Enhancement) ----
    const heroTagline = document.querySelector('.hero-tagline');
    
    if (heroTagline) {
        const originalText = heroTagline.textContent;
        heroTagline.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTagline.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            typeWriter();
        }, 500);
    }

    // ---- Current Year in Footer ----
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

    // ---- WhatsApp Float Animation on Scroll ----
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'translateY(0)';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.transform = 'translateY(20px)';
            }
        });
        
        // Initial state
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transform = 'translateY(20px)';
        whatsappFloat.style.transition = 'all 0.3s ease';
    }

    // ---- Preloader (Optional) ----
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ---- Console Easter Egg ----
    console.log('%c🍷 Antoniette Resto Bar Club', 'font-size: 20px; color: #D9919F; font-weight: bold;');
    console.log('%cLa noche cobra vida en Ramos Mejía', 'font-size: 12px; color: #B8B4B0;');
    console.log('%cDesarrollado con ❤️ por tuweben3dias.com', 'font-size: 10px; color: #9E5A6A;');
});

// ---- CSS Animation Keyframes (added via JS for lightbox) ----
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(styleSheet);