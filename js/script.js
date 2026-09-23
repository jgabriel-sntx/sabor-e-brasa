// script.js - Sabor & Brasa

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Header: fundo ao rolar + botão flutuante depois do hero
    const hero = document.getElementById('inicio');
    const fab = document.getElementById('fab');

    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 12);
        fab.classList.toggle('is-visible', y > hero.offsetHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // 2. Menu mobile
    const navToggle = document.getElementById('navToggle');
    const setNav = (open) => {
        header.classList.toggle('nav-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    navToggle.addEventListener('click', () => setNav(!header.classList.contains('nav-open')));
    document.querySelectorAll('#nav a').forEach(link => link.addEventListener('click', () => setNav(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

    // 3. Link ativo da navegação conforme a seção visível
    const navLinks = document.querySelectorAll('#nav a[href^="#"]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

    // 4. Status "aberto agora" e dia atual no quadro de horários
    // Abre todos os dias às 17h; o horário de fechamento não é informado, então consideramos até meia-noite.
    const now = new Date();
    const isOpen = now.getHours() >= 17;

    const status = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    const hoursBadge = document.getElementById('hoursBadge');

    if (isOpen) {
        status.classList.add('is-open');
        statusText.textContent = 'Brasa acesa. Aberto agora';
        hoursBadge.classList.add('is-open');
        hoursBadge.textContent = 'Aberto agora';
    } else {
        statusText.textContent = 'Hoje a partir das 17h';
    }

    const today = document.querySelector(`#hoursList li[data-day="${now.getDay()}"]`);
    if (today) today.classList.add('is-today');

    // 5. Abas do cardápio
    const tabs = document.querySelectorAll('.tab');
    const indicator = document.querySelector('.tabs-indicator');

    const moveIndicator = (tab) => {
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const staggerItems = (panel) => {
        panel.querySelectorAll('.menu-item').forEach((item, i) => {
            item.style.setProperty('--i', i);
            // Reinicia a animação de entrada ao trocar de aba
            item.style.animation = 'none';
            void item.offsetWidth;
            item.style.animation = '';
        });
    };

    const selectTab = (tab) => {
        tabs.forEach(t => {
            const active = t === tab;
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', String(active));
            t.tabIndex = active ? 0 : -1;
            panel.classList.toggle('is-active', active);
            panel.hidden = !active;
            if (active) staggerItems(panel);
        });
        moveIndicator(tab);
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const next = tabs[(index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
            next.focus();
            selectTab(next);
        });
    });

    const activeTab = document.querySelector('.tab.is-active');
    staggerItems(document.getElementById(activeTab.getAttribute('aria-controls')));
    // Espera as fontes carregarem para medir a largura correta da aba
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveIndicator(document.querySelector('.tab.is-active')));
    window.addEventListener('resize', () => moveIndicator(document.querySelector('.tab.is-active')));

    // 6. Revelação suave ao rolar
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 7. Botões magnéticos (apenas com mouse)
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // 8. Ano atual no rodapé
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
