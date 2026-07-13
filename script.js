document.addEventListener('DOMContentLoaded', () => {
    
    // ════ 1. LOGIKA HIDE/SHOW NAV ON SCROLL ════
    const navbar = document.querySelector('nav');
    
    function handleNavbar() {
        if (navbar) {
            if (window.scrollY > 20) {
                // Ketika mulai di-scroll ke bawah, munculkan nav
                navbar.style.transform = 'translateY(0)';
                navbar.style.opacity = '1';
                navbar.style.pointerEvents = 'all';
            } else {
                // Ketika berada di paling atas (on top), sembunyikan nav
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
                navbar.style.pointerEvents = 'none';
            }
        }
    }

    // Jalankan fungsi saat pertama kali dimuat & setiap kali di-scroll
    handleNavbar();
    window.addEventListener('scroll', handleNavbar);


    // ════ 2. LOGIKA CUSTOM CURSOR ════
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        if (cur) {
            cur.style.left = mx + 'px';
            cur.style.top = my + 'px';
        }
    });

    function animCursor() {
        rx += (mx - rx) * .1;
        ry += (my - ry) * .1;
        if (ring) {
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
        }
        requestAnimationFrame(animCursor);
    }
    animCursor();

    document.querySelectorAll('[data-h], button, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cur && ring) {
                cur.style.width = '18px';
                cur.style.height = '18px';
                ring.style.width = '50px';
                ring.style.height = '50px';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cur && ring) {
                cur.style.width = '10px';
                cur.style.height = '10px';
                ring.style.width = '34px';
                ring.style.height = '34px';
            }
        });
    });


    // ════ 3. TOPOGRAFI PEGUNUNGAN ABSTRAK PEKAT ════
    const canvas = document.getElementById('topoCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth || window.innerWidth;
            canvas.height = canvas.offsetHeight || window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let time = 0;

        function animateTopology() {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 0.85;

            const totalLayers = 70;    
            const pointsPerLine = 160; 

            const originX = width * 0.95;
            const originY = height * -0.05; 

            const peaks = [
                { xPct: 0.80, yPct: 0.15, force: 180 }, 
                { xPct: 0.92, yPct: 0.08, force: 150 }, 
                { xPct: 0.74, yPct: 0.32, force: 160 }  
            ];

            for (let i = 0; i < totalLayers; i++) {
                ctx.beginPath();
                
                let baseRadius = 40 + (i * 9); 

                for (let j = 0; j <= pointsPerLine; j++) {
                    let angle = (j / pointsPerLine) * Math.PI * 2;

                    let baseX = originX + Math.cos(angle) * baseRadius * 1.25; 
                    let baseY = originY + Math.sin(angle) * baseRadius;

                    let factorX = baseX * 0.0055;
                    let factorY = baseY * 0.0055;

                    let n1 = Math.sin(factorX * 2.8 + factorY * 1.8 - time * 0.55) * 32;
                    let n2 = Math.cos(factorY * 6.0 + time * 0.35) * Math.sin(factorX * 4.5) * 18;
                    let n3 = Math.sin((baseX + baseY) * 0.035 + time) * 6;

                    let totalNoise = n1 + n2 + n3;

                    let radialWeight = Math.exp(-Math.pow(baseRadius - 260, 2) / 70000);
                    let finalRadius = baseRadius + (totalNoise * radialWeight * 1.2);

                    let x = originX + Math.cos(angle) * finalRadius * 1.28;
                    let y = originY + Math.sin(angle) * finalRadius;

                    if (x >= 0 && y >= 0 && x <= width && y <= height) {
                        if (j === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                }

                let currentEdgeX = originX + Math.cos(Math.PI * 1.1) * (baseRadius * 1.28);
                let fadeProgress = Math.min(1, Math.max(0, (currentEdgeX / (width * 0.45))));
                let alpha = (0.18 - (i * 0.001)) * fadeProgress; 
                
                ctx.strokeStyle = `rgba(16, 16, 16, ${Math.max(0, alpha)})`;
                ctx.stroke();
            }

            time += 0.005; 
            requestAnimationFrame(animateTopology);
        }
        animateTopology();
    }


    // ════ 4. SKILL BAR ANIMATION ON SCROLL ════
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


    // ════ 5. ACTIVE NAV LINK ON SCROLL ════
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            const sectionTop = s.offsetTop;
            if (window.scrollY >= (sectionTop - 120)) {
                current = s.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.style.color = (a.getAttribute('href') === '#' + current) ? 'var(--accent)' : '';
        });
    });


    // ════ 6. SMOOTH SCROLL FALLBACK ════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetID = this.getAttribute('href');
            const targetSection = document.querySelector(targetID);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});