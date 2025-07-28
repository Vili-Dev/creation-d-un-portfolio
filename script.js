function initBackgroundAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = [];
    const numBubbles = window.innerWidth > 768 ? 100 : 50;

    for (let i = 0; i < numBubbles; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4,
            velocity: Math.random() * 0.5 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';

        for (let i = 0; i < numBubbles; i++) {
            const bubble = bubbles[i];
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();

            bubble.y -= bubble.velocity;
            if (bubble.y < -bubble.radius) {
                bubble.y = canvas.height + bubble.radius;
                bubble.x = Math.random() * canvas.width;
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initThemeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🌓';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Basculer entre thème clair et sombre');
    document.body.appendChild(toggle);

    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.setAttribute('aria-pressed', savedTheme === 'dark');

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggle.setAttribute('aria-pressed', newTheme === 'dark');
    });
}

function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => observer.observe(item));
}

function initSkillGame() {
    const cards = document.querySelectorAll('.skill-card');
    
    cards.forEach(card => {
        const back = document.createElement('div');
        back.className = 'skill-back';
        back.innerHTML = `
            <p><strong>Niveau :</strong> ${card.dataset.level}</p>
            <p><strong>Projets :</strong> ${card.dataset.projects}</p>
        `;
        card.appendChild(back);
        
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', card.classList.contains('flipped'));
            card.setAttribute('aria-label', 
                card.classList.contains('flipped') ? 
                `Cacher les détails de ${card.dataset.skill}` : 
                `Afficher les détails de ${card.dataset.skill}`
            );
        });
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundAnimation();
    initThemeToggle();
    initTimeline();
    initSkillGame();
    
    // Animation au défilement
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            console.log('Form submitted:', { name, email, message });
            alert('Merci pour votre message, ' + name + '! Nous vous répondrons bientôt.');
        });
    }
});