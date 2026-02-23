// Events section rendering and hover effects
import { eventTypes } from '../data/inflables.js';

export function initEvents() {
    const grid = document.getElementById('eventsGrid');

    grid.innerHTML = eventTypes.map((event, i) => `
    <div class="event-card reveal" style="transition-delay: ${i * 0.1}s">
      <div class="event-card__image">
        <img src="${event.image}" alt="${event.title}" loading="lazy" />
        <div class="event-card__image-overlay">
          <span class="event-card__icon">${event.icon}</span>
        </div>
      </div>
      <div class="event-card__body">
        <h3 class="event-card__title">${event.title}</h3>
        <p class="event-card__desc">${event.description}</p>
        <a href="#contacto" class="event-card__cta">
          Cotizar →
        </a>
      </div>
    </div>
  `).join('');

    // Reveal observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    grid.querySelectorAll('.event-card').forEach(card => observer.observe(card));
}
