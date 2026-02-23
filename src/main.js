// Vagones de Sonrisas — Main Entry Point
import { initNavigation } from './js/navigation.js';
import { initInflables } from './js/inflables.js';
import { initCounters } from './js/counters.js';
import { initTestimonials } from './js/testimonials.js';
import { initTimeline } from './js/timeline.js';
import { initContact } from './js/contact.js';
import { initEvents } from './js/events.js';
import { initThreeHero } from './js/three-hero.js';

// Dark mode
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('theme');

  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    icon.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// Scroll reveal for section headers
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Init all modules on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initThreeHero();       // Three.js 3D balloons in hero
  initInflables();
  initCounters();
  initEvents();
  initTestimonials();
  initTimeline();
  initContact();
  initScrollReveal();
});
