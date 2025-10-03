export function setupForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.textContent = 'Vielen Dank für deine Nachricht! (Dies ist eine Demo)';
        form.reset();
    });
}