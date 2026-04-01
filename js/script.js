// script.js - Sabor & Brasa

document.addEventListener('DOMContentLoaded', function() {

    // 1. Inicializar ícones do Feather Icons
    feather.replace();

    // 2. Fechar menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('#navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // 3. Smooth Scroll melhorado (para links da navbar)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight || 80;
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Botão WhatsApp com mensagem personalizada (opcional mas legal)
    const whatsappBtn = document.querySelector('a[href*="whatsapp.com"]');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Você pode adicionar tracking ou mensagem dinâmica aqui no futuro
            console.log('Cliente abriu WhatsApp para fazer pedido');
        });
    }

    // 5. Animação suave ao scroll (fade in nos cards)
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // 6. Mostrar ano atual no footer automaticamente (boa prática)
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    console.log('%c✅ Sabor & Brasa - Script carregado com sucesso!', 'color: #dc3545; font-weight: bold;');
});