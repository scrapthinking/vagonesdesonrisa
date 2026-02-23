// Timeline with scroll-triggered reveals
import { timelineEvents } from '../data/inflables.js';

export function initTimeline() {
    const track = document.getElementById('timelineTrack');

    // Render timeline
    track.innerHTML = timelineEvents.map((event, i) => `
    <div class="timeline-item reveal" style="transition-delay: ${i * 0.15}s">
      <div class="timeline-item__dot"></div>
      <div class="timeline-item__content">
        <span class="timeline-item__year">${event.year}</span>
        <h3 class="timeline-item__title">${event.title}</h3>
        <p class="timeline-item__desc">${event.description}</p>
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

    track.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
}
