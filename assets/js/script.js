// assets/js/script.js — Premium Animation Engine

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 1. Mobile Menu Toggle
    // ─────────────────────────────────────────
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
            }
        });
    });

    // ─────────────────────────────────────────
    // 2. Sticky Header
    // ─────────────────────────────────────────
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─────────────────────────────────────────
    // 3. Active Nav Link
    // ─────────────────────────────────────────
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // ─────────────────────────────────────────
    // 4. Scroll Reveal — Intersection Observer
    // ─────────────────────────────────────────
    const revealSelectors = [
        '.section-title', '.section-desc', '.service-card', '.product-card',
        '.stat-item', '.sobre-image', '.sobre-content', '.contato-info',
        '.contato-form-wrapper', '.hero-content', '.hero-image-wrapper',
        '.service-detail-row', '.contato-lista li'
    ];

    document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
        el.classList.add('hidden-reveal');
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active-reveal');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(revealSelectors.join(', ')).forEach(el => revealObserver.observe(el));

    // ─────────────────────────────────────────
    // 5. Floating Particles (Hero + Page Headers)
    // ─────────────────────────────────────────
    function createParticles(container, count = 18) {
        const wrap = document.createElement('div');
        wrap.className = 'particles-wrap';
        container.style.position = 'relative';
        container.appendChild(wrap);

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 2; // 2–8px
            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                animation-duration: ${Math.random() * 12 + 8}s;
                animation-delay: ${Math.random() * 10}s;
            `;
            wrap.appendChild(p);
        }
    }

    // Inject particles into hero and page-header sections
    document.querySelectorAll('.hero, .page-header, .cta').forEach(section => {
        createParticles(section, 20);
    });

    // ─────────────────────────────────────────
    // 6. Floating Orbs (subtle glowing blobs in sections)
    // ─────────────────────────────────────────
    function addOrbs(section) {
        const positions = [
            { cls: 'orb-gold', size: 300, top: '-10%', left: '-5%' },
            { cls: 'orb-blue', size: 400, top: '50%', right: '-10%' },
        ];
        positions.forEach(({ cls, size, top, left, right }) => {
            const orb = document.createElement('div');
            orb.className = `orb ${cls}`;
            orb.style.cssText = `width:${size}px; height:${size}px; top:${top}; ${left ? 'left:' + left : 'right:' + right};`;
            section.style.position = 'relative';
            section.appendChild(orb);
        });
    }

    document.querySelectorAll('.section, .stats, .produtos, .page-header').forEach(s => addOrbs(s));

    // ─────────────────────────────────────────
    // 7. Stat Counter Animation
    // ─────────────────────────────────────────
    function animateCounter(el) {
        const raw = el.textContent.trim();
        const hasPlus = raw.includes('+');
        const hasMi = raw.toLowerCase().includes('mi') || raw.includes('M');
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return;

        const duration = 1800;
        const start = performance.now();

        el.classList.add('counting');

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * num);
            const suffix = hasMi ? 'M' : '';
            el.textContent = (hasPlus ? '+' : '') + current + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = raw; // restore original text
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stats-container').forEach(el => statsObserver.observe(el));

    // ─────────────────────────────────────────
    // 8. Typing / Typewriter Effect on Hero Badge or Title
    // ─────────────────────────────────────────
    const typingTarget = document.querySelector('.badge');
    if (typingTarget) {
        const texts = [
            'Educador Financeiro',
            'Especialista em Investimentos',
            'Consultor Independente',
        ];
        let tIndex = 0, cIndex = 0, deleting = false;
        const cursor = document.createElement('span');
        cursor.className = 'typed-cursor';
        typingTarget.after(cursor);

        const originalText = typingTarget.textContent;
        typingTarget.textContent = '';

        function type() {
            const current = texts[tIndex];
            if (!deleting) {
                typingTarget.textContent = current.slice(0, cIndex + 1);
                cIndex++;
                if (cIndex === current.length) {
                    deleting = true;
                    setTimeout(type, 2200);
                    return;
                }
            } else {
                typingTarget.textContent = current.slice(0, cIndex - 1);
                cIndex--;
                if (cIndex === 0) {
                    deleting = false;
                    tIndex = (tIndex + 1) % texts.length;
                }
            }
            setTimeout(type, deleting ? 40 : 70);
        }
        type();
    }

    // ─────────────────────────────────────────
    // 9. Floating WhatsApp Button (injected globally)
    // ─────────────────────────────────────────
    const waFloat = document.createElement('a');
    waFloat.href = 'https://wa.me/5569992162700';
    waFloat.target = '_blank';
    waFloat.title = 'Falar no WhatsApp';
    waFloat.className = 'whatsapp-float';
    waFloat.setAttribute('aria-label', 'Falar no WhatsApp');
    waFloat.innerHTML = '<i class="ph-fill ph-whatsapp-logo"></i>';
    document.body.appendChild(waFloat);

    // ─────────────────────────────────────────
    // 10. Card Tilt Effect (subtle 3D on mouse move)
    // ─────────────────────────────────────────
    document.querySelectorAll('.service-card, .product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xPct = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct = (e.clientY - rect.top) / rect.height - 0.5;
            const tiltX = yPct * -8;  // degrees
            const tiltY = xPct * 8;
            card.style.transform = `translateY(-10px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ─────────────────────────────────────────
    // 11. Hero Icon Rotation — financial/growth themes
    // ─────────────────────────────────────────
    const graphicIcon = document.querySelector('.graphic-element i');
    if (graphicIcon) {
        // Phosphor icon classes to cycle through
        const icons = [
            'ph-fill ph-trend-up',           // gráfico subindo
            'ph-fill ph-currency-dollar',     // cifrão
            'ph-fill ph-coins',               // moedas
            'ph-fill ph-chart-line-up',       // linha de crescimento
            'ph-fill ph-bank',                // banco / instituição
            'ph-fill ph-piggy-bank',          // poupança
            'ph-fill ph-rocket-launch',       // crescimento acelerado
            'ph-fill ph-crown',               // excelência / topo
        ];

        let iconIndex = 0;

        function cycleIcon() {
            iconIndex = (iconIndex + 1) % icons.length;

            // Phase 1: fade out + shrink current icon
            graphicIcon.classList.add('fading-out');
            graphicIcon.classList.remove('fading-in');

            setTimeout(() => {
                // Swap the icon classes
                graphicIcon.className = icons[iconIndex];
                graphicIcon.classList.add('fading-out'); // still hidden at this point

                // Phase 2: fade in + scale new icon
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        graphicIcon.classList.remove('fading-out');
                        graphicIcon.classList.add('fading-in');
                    });
                });
            }, 500); // wait for fade-out to complete (matches CSS transition time)
        }

        // Start cycle every 3.5 seconds
        setInterval(cycleIcon, 3500);
    }

});
