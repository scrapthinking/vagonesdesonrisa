// Contact form validation and submission
export function initContact() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const nombre = form.nombre.value.trim();
        const telefono = form.telefono.value.trim();
        const email = form.email.value.trim();

        if (!nombre || !telefono || !email) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';

        // Simulate submission
        setTimeout(() => {
            formSuccess.classList.add('visible');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
        <span>Enviar Solicitud</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      `;

            // Reset after 4 seconds
            setTimeout(() => {
                formSuccess.classList.remove('visible');
                form.reset();
            }, 4000);
        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}
