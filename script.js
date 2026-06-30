document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logika Custom Cursor
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
    });

    (function anim() {
        rx += (mx - rx) * .1;
        ry += (my - ry) * .1;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(anim);
    })();

    // Efek membesar pada kursor saat hover elemen interaktif
    document.querySelectorAll('[data-h], button, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cur.style.width = '18px';
            cur.style.height = '18px';
            ring.style.width = '50px';
            ring.style.height = '50px';
        });
        el.addEventListener('mouseleave', () => {
            cur.style.width = '10px';
            cur.style.height = '10px';
            ring.style.width = '34px';
            ring.style.height = '34px';
        });
    });

    // 2. Skill bar animation on scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.sk-fill').forEach(f => {
                    setTimeout(() => {
                        f.style.width = f.getAttribute('data-t') + '%';
                    }, 150);
                });
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .25 });

    document.querySelectorAll('.sk-list').forEach(el => obs.observe(el));

    // 3. Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            const sectionTop = s.offsetTop;
            const sectionHeight = s.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = s.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.style.color = (a.getAttribute('href') === '#' + current) ? 'var(--accent)' : '';
        });
    });

    // 4. Smooth Scroll Fallback (Jika diperlukan)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});