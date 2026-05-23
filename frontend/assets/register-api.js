// Registration form handler for Sehat Setu

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    // prefer configured backendUrl from config.js, otherwise fallback
    const apiBase = (typeof window !== 'undefined' && window.backendUrl) ? window.backendUrl : 'http://127.0.0.1:8000';

    function fetchWithTimeout(url, options = {}, timeout = 7000) {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchPromise = fetch(url, { ...options, signal });
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        return fetchPromise.finally(() => clearTimeout(timeoutId));
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const [nameInput, phoneInput, emailInput, cityInput, passwordInput] = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="password"]');
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!name || !email || !password) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetchWithTimeout(`${apiBase}/api/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone: phoneInput.value.trim(), city: cityInput.value.trim() })
            }, 7000);

            // If the response is not JSON, guard against parse errors
            let data = {};
            try { data = await response.json(); } catch (e) { data = {}; }

            if (response.ok) {
                alert('Registration successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || `Registration failed (status ${response.status}).`);
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Could not connect to server. Please ensure the backend is running and try again.');
        }
    });
});
