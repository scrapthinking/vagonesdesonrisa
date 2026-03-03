// Inflatable gallery with collection buttons → navigate to inflables.html
import { inflables } from '../data/inflables.js';

const collectionMeta = {
    todos: { icon: '🎪', title: 'Todos los Inflables', subtitle: 'Nuestro catálogo completo con más de 30 inflables para todas las edades', theme: '' },
    carmenciris: { icon: '🌈', title: 'Carmenciris', subtitle: 'Un mundo de colores, nubes y sol donde la magia y la diversión se encuentran', theme: 'modal-theme--carmenciris' },
    ready: { icon: '🚀', title: 'Ready Vagones', subtitle: 'Del espacio exterior han llegado nuevas y extrañas formas para la diversión extrema', theme: 'modal-theme--ready' },
    elementos: { icon: '🌊', title: 'Elementos', subtitle: 'Tierra, Agua, Fuego y Aire — los cuatro elementos de la diversión', theme: 'modal-theme--elementos' },
    otros: { icon: '✨', title: 'Otros Inflables', subtitle: 'Mini castillos y especiales para los más chiquitos', theme: '' },
};

let currentCollection = 'todos';
let currentAge = 'todos';
let currentIndex = 0;
let filteredItems = [];

function getFilteredInflables() {
    let filtered = [...inflables];
    if (currentCollection !== 'todos') {
        filtered = filtered.filter(i => i.collection === currentCollection);
    }
    if (currentAge !== 'todos') {
        filtered = filtered.filter(i => i.age === currentAge);
    }
    return filtered;
}

function getBadge(tags) {
    if (tags.includes('nuevo')) return { class: 'inflable-card__badge--nuevo', text: '✨ Nuevo' };
    if (tags.includes('popular')) return { class: 'inflable-card__badge--popular', text: '🔥 Popular' };
    if (tags.includes('extremo')) return { class: 'inflable-card__badge--extremo', text: '⚡ Extremo' };
    return null;
}

function getAgeLabel(age) {
    const labels = { '0-6': '0–6 años', '7+': '7+ años', 'adultos': 'Adultos' };
    return labels[age] || age;
}

function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('carouselCounter');
    const dots = document.getElementById('carouselDots');
    if (!track) return;
    filteredItems = getFilteredInflables();

    if (filteredItems.length === 0) {
        track.innerHTML = `
      <div class="carousel-slide">
        <div class="carousel-slide__empty">
          <div class="carousel-slide__empty-icon">🔍</div>
          <p>No hay inflables en esta categoría por ahora.</p>
        </div>
      </div>
    `;
        if (counter) counter.textContent = '0 / 0';
        if (dots) dots.innerHTML = '';
        return;
    }

    currentIndex = Math.min(currentIndex, filteredItems.length - 1);

    track.innerHTML = filteredItems.map((item, i) => {
        const badge = getBadge(item.tags);
        const collectionLabel = item.collection === 'ready' ? '🚀 Ready'
            : item.collection === 'carmenciris' ? '🌈 Carmenciris'
                : item.collection === 'otros' ? '✨ Otros'
                    : '🌊 Elementos';
        return `
      <div class="carousel-slide">
        <div class="carousel-slide__card">
          <div class="carousel-slide__image">
            <img src="${item.image}" alt="Inflable ${item.name}" loading="${i < 3 ? 'eager' : 'lazy'}" />
            ${badge ? `<span class="inflable-card__badge ${badge.class}">${badge.text}</span>` : ''}
          </div>
          <div class="carousel-slide__body">
            <h3 class="carousel-slide__name">${item.name}</h3>
            <p class="carousel-slide__desc">${item.description}</p>
            <div class="carousel-slide__meta">
              <span class="carousel-slide__tag">${getAgeLabel(item.age)}</span>
              <span class="carousel-slide__tag">${collectionLabel}</span>
              ${item.acuatico ? '<span class="carousel-slide__tag">💧 Acuático</span>' : ''}
              <span class="carousel-slide__tag">👥 ${item.capacidad}</span>
            </div>
            <a href="#contacto" class="btn btn--primary carousel-slide__cta" onclick="document.getElementById('inflablesModal').classList.remove('open'); document.body.style.overflow = '';">
              Cotizar este inflable
            </a>
          </div>
        </div>
      </div>
    `;
    }).join('');

    if (dots) {
        dots.innerHTML = filteredItems.map((_, i) => `
    <button class="carousel-dot ${i === currentIndex ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
  `).join('');
    }

    updateSlidePosition(false);
}

function updateSlidePosition(animate = true) {
    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('carouselCounter');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track) return;

    track.style.transition = animate ? 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (counter) counter.textContent = `${currentIndex + 1} / ${filteredItems.length}`;

    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

function closeModal() {
    const modal = document.getElementById('inflablesModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

export function initInflables() {
    // Collection buttons → navigate to inflables.html?collection=X
    document.querySelectorAll('.collection-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const collection = btn.dataset.collection;
            window.location.href = `/inflables.html?collection=${collection}`;
        });
    });

    // Modal close (kept for compatibility)
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('inflablesModal');
        if (!modal) return;
        if (e.key === 'Escape') closeModal();
        if (!modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') { currentIndex = Math.max(0, currentIndex - 1); updateSlidePosition(); }
        if (e.key === 'ArrowRight') { currentIndex = Math.min(filteredItems.length - 1, currentIndex + 1); updateSlidePosition(); }
    });

    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDotsEl = document.getElementById('carouselDots');

    if (carouselPrev) carouselPrev.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateSlidePosition(); }
    });
    if (carouselNext) carouselNext.addEventListener('click', () => {
        if (currentIndex < filteredItems.length - 1) { currentIndex++; updateSlidePosition(); }
    });

    if (carouselDotsEl) {
        carouselDotsEl.addEventListener('click', (e) => {
            const dot = e.target.closest('.carousel-dot');
            if (dot) { currentIndex = parseInt(dot.dataset.index); updateSlidePosition(); }
        });
    }

    document.querySelectorAll('.modal-age-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-age-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAge = btn.dataset.age;
            currentIndex = 0;
            renderCarousel();
        });
    });

    const trackWrapper = document.querySelector('.inflables-modal__track-wrapper');
    if (trackWrapper) {
        let touchStartX = 0;
        trackWrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        trackWrapper.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < filteredItems.length - 1) { currentIndex++; updateSlidePosition(); }
                else if (diff < 0 && currentIndex > 0) { currentIndex--; updateSlidePosition(); }
            }
        });
    }

    // Footer navigation links → navigate to new page
    document.querySelectorAll('[data-collection]').forEach(link => {
        if (link.classList.contains('collection-btn')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const collection = link.dataset.collection;
            window.location.href = `/inflables.html?collection=${collection}`;
        });
    });
}
