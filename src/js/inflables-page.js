// Inflables Page — Hero slider + filtros + grid de tarjetas
import { inflables } from '../data/inflables.js';

// ===========================
// HERO SLIDER
// ===========================
const sliderImages = inflables
    .filter(i => i.image)
    .slice(0, 12);

let heroIndex = 0;
let heroTimer = null;

const collectionNames = {
    carmenciris: '🌈 Carmenciris',
    ready: '🚀 Ready Vagones',
    elementos: '🌊 Elementos',
    otros: '✨ Otros'
};

function buildHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const dotsContainer = document.getElementById('heroDots');
    if (!slider) return;

    slider.innerHTML = sliderImages.map(item => `
    <div class="inflables-hero__slide" style="background-image: url('${item.image}')"></div>
  `).join('');

    dotsContainer.innerHTML = sliderImages.map((_, i) => `
    <button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
  `).join('');

    // Add slide name indicator
    const nameEl = document.createElement('div');
    nameEl.className = 'inflables-hero__slide-name';
    nameEl.id = 'heroSlideName';
    nameEl.textContent = sliderImages[0].name;
    document.getElementById('inflablesHero').appendChild(nameEl);

    dotsContainer.addEventListener('click', e => {
        const dot = e.target.closest('.hero-dot');
        if (dot) goToSlide(parseInt(dot.dataset.index));
    });

    document.getElementById('heroPrev').addEventListener('click', () => {
        goToSlide((heroIndex - 1 + sliderImages.length) % sliderImages.length);
    });
    document.getElementById('heroNext').addEventListener('click', () => {
        goToSlide((heroIndex + 1) % sliderImages.length);
    });

    startAutoSlide();
}

function goToSlide(index) {
    heroIndex = index;
    const slider = document.getElementById('heroSlider');
    slider.style.transform = `translateX(-${heroIndex * 100}%)`;

    document.querySelectorAll('.hero-dot').forEach((d, i) => {
        d.classList.toggle('active', i === heroIndex);
    });

    const nameEl = document.getElementById('heroSlideName');
    if (nameEl) {
        nameEl.style.opacity = '0';
        setTimeout(() => {
            nameEl.textContent = sliderImages[heroIndex].name;
            nameEl.style.opacity = '1';
        }, 300);
    }

    resetAutoSlide();
}

function startAutoSlide() {
    heroTimer = setInterval(() => {
        goToSlide((heroIndex + 1) % sliderImages.length);
    }, 4000);
}

function resetAutoSlide() {
    clearInterval(heroTimer);
    startAutoSlide();
}

// Touch swipe for hero
function initHeroSwipe() {
    const hero = document.getElementById('inflablesHero');
    let startX = 0;
    hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    hero.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide((heroIndex + 1) % sliderImages.length);
            else goToSlide((heroIndex - 1 + sliderImages.length) % sliderImages.length);
        }
    });
}

// ===========================
// FILTER STATE
// ===========================
let filterCollection = 'todos';
let filterAge = 'todos';
let filterType = 'todos';

function getFiltered() {
    return inflables.filter(item => {
        const matchCollection = filterCollection === 'todos' || item.collection === filterCollection;
        const matchAge = filterAge === 'todos' || item.age === filterAge;
        const matchType = filterType === 'todos'
            || (filterType === 'acuatico' && item.acuatico)
            || (filterType === 'terrestre' && !item.acuatico);
        return matchCollection && matchAge && matchType;
    });
}

// ===========================
// RENDER GRID
// ===========================
function getAgeLabel(age) {
    const map = { '0-6': '👶 0–6 años', '7+': '🧒 7+ años', 'adultos': '🧑 Adultos' };
    return map[age] || age;
}

function getCollectionLabel(col) {
    const map = {
        carmenciris: '🌈 Carmenciris',
        ready: '🚀 Ready',
        elementos: '🌊 Elementos',
        otros: '✨ Otros'
    };
    return map[col] || col;
}

function getBadge(tags) {
    if (tags.includes('nuevo')) return { cls: 'inflable-card__badge--nuevo', text: '✨ Nuevo' };
    if (tags.includes('popular')) return { cls: 'inflable-card__badge--popular', text: '🔥 Popular' };
    if (tags.includes('extremo')) return { cls: 'inflable-card__badge--extremo', text: '⚡ Extremo' };
    return null;
}

function getExtraTags(item) {
    const extras = [...item.tags].filter(t => !['popular', 'nuevo', 'extremo', 'acuático'].includes(t));
    return extras.slice(0, 3);
}

function renderGrid() {
    const grid = document.getElementById('catalogoGrid');
    const empty = document.getElementById('catalogoEmpty');
    const countEl = document.getElementById('countNumber');

    const items = getFiltered();
    countEl.textContent = items.length;

    if (items.length === 0) {
        grid.innerHTML = '';
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = items.map((item, i) => {
        const badge = getBadge(item.tags);
        const extras = getExtraTags(item);
        const collLabel = getCollectionLabel(item.collection);

        return `
      <article class="inflable-card" style="animation-delay: ${i * 0.05}s">
        <div class="inflable-card__img-wrapper">
          <img
            class="inflable-card__img"
            src="${item.image}"
            alt="Inflable ${item.name}"
            loading="${i < 6 ? 'eager' : 'lazy'}"
          />
          ${badge ? `<span class="inflable-card__badge ${badge.cls}">${badge.text}</span>` : ''}
          ${item.acuatico ? `<div class="inflable-card__acuatico" title="Acuático">💧</div>` : ''}
          <div class="inflable-card__stripe inflable-card__stripe--${item.collection}"></div>
        </div>
        <div class="inflable-card__body">
          <p class="inflable-card__collection-label inflable-card__collection-label--${item.collection}">
            ${collLabel}
          </p>
          <h3 class="inflable-card__name">${item.name}</h3>
          <p class="inflable-card__desc">${item.description}</p>

          <!-- Tags enriquecidos -->
          <div class="inflable-card__tags">
            <span class="inflable-tag inflable-tag--age">${getAgeLabel(item.age)}</span>
            ${item.acuatico ? `<span class="inflable-tag inflable-tag--acuatico">💧 Acuático</span>` : ''}
            <span class="inflable-tag inflable-tag--capacidad">👥 ${item.capacidad}</span>
            ${extras.map(t => `<span class="inflable-tag inflable-tag--extra">${t}</span>`).join('')}
          </div>

          <a
            href="https://wa.me/573052382057?text=Hola%20Vagones%20de%20Sonrisas%2C%20me%20gustaría%20cotizar%20el%20inflable%20${encodeURIComponent(item.name)}"
            target="_blank"
            rel="noopener"
            class="inflable-card__cta"
          >
            Cotizar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </article>
    `;
    }).join('');
}

// ===========================
// INIT FILTERS
// ===========================
function initFilters() {
    // Collection tabs
    document.getElementById('collectionTabs').addEventListener('click', e => {
        const btn = e.target.closest('.col-tab');
        if (!btn) return;
        document.querySelectorAll('.col-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCollection = btn.dataset.collection;
        renderGrid();
    });

    // Age filters
    document.getElementById('ageFilters').addEventListener('click', e => {
        const btn = e.target.closest('.age-filter');
        if (!btn) return;
        document.querySelectorAll('.age-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterAge = btn.dataset.age;
        renderGrid();
    });

    // Type filters
    document.getElementById('typeFilters').addEventListener('click', e => {
        const btn = e.target.closest('.type-filter');
        if (!btn) return;
        document.querySelectorAll('.type-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterType = btn.dataset.type;
        renderGrid();
    });

    // Clear filters
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterCollection = 'todos';
            filterAge = 'todos';
            filterType = 'todos';
            document.querySelectorAll('.col-tab').forEach((b, i) => b.classList.toggle('active', i === 0));
            document.querySelectorAll('.age-filter').forEach((b, i) => b.classList.toggle('active', i === 0));
            document.querySelectorAll('.type-filter').forEach((b, i) => b.classList.toggle('active', i === 0));
            renderGrid();
        });
    }
}

// ===========================
// READ URL PARAMS
// ===========================
function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const col = params.get('collection');
    if (col && ['carmenciris', 'ready', 'elementos', 'otros', 'todos'].includes(col)) {
        filterCollection = col;
        // activate tab
        document.querySelectorAll('.col-tab').forEach(b => {
            b.classList.toggle('active', b.dataset.collection === col);
        });
    }
}

// ===========================
// NAV / DARK MODE (minimal)
// ===========================
function initNavPage() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initThemePage() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.textContent = '☀️';
    }
    if (toggle) {
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            if (icon) icon.textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }
}

// ===========================
// BOOT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initThemePage();
    initNavPage();
    buildHeroSlider();
    initHeroSwipe();
    readUrlParams();
    initFilters();
    renderGrid();
});
