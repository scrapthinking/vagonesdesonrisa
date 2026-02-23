// Testimonial carousel
import { testimonials } from '../data/inflables.js';

export function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    let currentIndex = 0;
    let autoPlayInterval;

    // Render testimonials
    track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-card__avatar">${t.avatar}</div>
      <div class="testimonial-card__stars">${'★'.repeat(t.rating)}</div>
      <p class="testimonial-card__text">${t.text}</p>
      <div class="testimonial-card__name">${t.name}</div>
      <div class="testimonial-card__event">${t.event}</div>
    </div>
  `).join('');

    // Render dots
    dotsContainer.innerHTML = testimonials.map((_, i) => `
    <button class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Testimonio ${i + 1}"></button>
  `).join('');

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goTo(index) {
        currentIndex = ((index % testimonials.length) + testimonials.length) % testimonials.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoPlay(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            resetAutoPlay();
        });
    });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
            resetAutoPlay();
        }
    });

    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goTo(currentIndex + 1), 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();
}
