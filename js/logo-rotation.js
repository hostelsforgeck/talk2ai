// Smooth logo rotation with acceleration
(function() {
    const logoImg = document.querySelector('.logo-img');
    const logoBox = document.querySelector('.logo-box');

    if (!logoImg || !logoBox) return;

    // Honour the OS reduce-motion setting: leave the logo static.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let currentRotation = 0;
    let targetSpeed = 18; // degrees per frame (slow)
    let currentSpeed = 18;
    const fastSpeed = 70; // degrees per frame (fast)
    let rafId = 0;

    function animateLogo() {
        // Smoothly transition speed
        const speedDiff = targetSpeed - currentSpeed;
        currentSpeed += speedDiff * 0.05; // ease towards target

        currentRotation += currentSpeed / 60; // 60fps
        if (currentRotation >= 360) currentRotation -= 360;

        logoImg.style.transform = `rotate(${currentRotation}deg)`;
        rafId = requestAnimationFrame(animateLogo);
    }

    function start() {
        if (!rafId) rafId = requestAnimationFrame(animateLogo);
    }

    function stop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }
    }

    logoBox.addEventListener('mouseenter', () => {
        targetSpeed = fastSpeed;
    });

    logoBox.addEventListener('mouseleave', () => {
        targetSpeed = 18;
    });

    // Don't burn frames (and phone battery) animating a logo that sits in a
    // backgrounded tab or has been scrolled out of view.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !document.hidden) start(); else stop();
            });
        }, { threshold: 0 }).observe(logoBox);
    }

    start();
})();
