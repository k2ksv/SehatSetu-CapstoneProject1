// API helper for dashboard
const backendUrl = 'http://127.0.0.1:8000';

async function fetchUsers() {
    try {
        const response = await fetch(`${backendUrl}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Render users in dashboard (example)
function renderUsers(users) {
    const container = document.getElementById('user-list');
    if (!container) return;
    container.innerHTML = users.map(user => `
        <li><strong>${user.name}</strong> (${user.email})</li>
    `).join('');
}

// On dashboard load, fetch and show users
if (window.location.pathname.endsWith('dashboard.html')) {
    fetchUsers().then(renderUsers);
}
