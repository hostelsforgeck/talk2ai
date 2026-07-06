// Smooth logo rotation with acceleration
(function() {
    const logoImg = document.querySelector('.logo-img');
    const logoBox = document.querySelector('.logo-box');
    
    if (logoImg && logoBox) {
        let currentRotation = 0;
        let targetSpeed = 18; // degrees per frame (slow)
        let currentSpeed = 18;
        const fastSpeed = 70; // degrees per frame (fast)
        
        function animateLogo() {
            // Smoothly transition speed
            const speedDiff = targetSpeed - currentSpeed;
            currentSpeed += speedDiff * 0.05; // ease towards target
            
            currentRotation += currentSpeed / 60; // 60fps
            if (currentRotation >= 360) currentRotation -= 360;
            
            logoImg.style.transform = `rotate(${currentRotation}deg)`;
            requestAnimationFrame(animateLogo);
        }
        
        logoBox.addEventListener('mouseenter', () => {
            targetSpeed = fastSpeed;
        });
        
        logoBox.addEventListener('mouseleave', () => {
            targetSpeed = 18;
        });
        
        animateLogo();
    }
})();
