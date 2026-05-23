const backendUrl = 'http://127.0.0.1:8000';
let currentUser = null;

async function checkAuth() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/current-user/`, {
            credentials: 'include'
        });
        if (response.ok) {
            currentUser = await response.json();
            if (currentUser.user_type !== 'admin') {
                window.location.href = 'login.html';
                return;
            }
            initializeDashboard();
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
    }
}

function initializeDashboard() {
    if (!currentUser) return;

    // Update greeting
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';

    greeting.textContent = `${timeGreeting}, ${currentUser.first_name || 'Admin'}`;

    // Load dashboard data
    loadOverviewStats();
    loadUsers();
    loadAppointments();
    loadReports();
    loadSystemInfo();
}

async function loadOverviewStats() {
    try {
        // Load users count
        const usersResponse = await fetch(`${backendUrl}/api/auth/users/`, {
            credentials: 'include'
        });
        const usersData = await usersResponse.json();
        const users = usersData.users || [];

        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-doctors').textContent = users.filter(u => u.user_type === 'doctor').length;
        document.getElementById('total-patients').textContent = users.filter(u => u.user_type === 'patient').length;

        // Load appointments count
        const appointmentsResponse = await fetch(`${backendUrl}/api/appointments/`, {
            credentials: 'include'
        });
        const appointmentsData = await appointmentsResponse.json();
        const appointments = appointmentsData.appointments || [];
        document.getElementById('total-appointments').textContent = appointments.length;

        // Load hospitals count
        const hospitalsResponse = await fetch(`${backendUrl}/api/hospitals/`, {
            credentials: 'include'
        });
        const hospitalsData = await hospitalsResponse.json();
        const hospitals = hospitalsData.hospitals || [];
        document.getElementById('total-hospitals').textContent = hospitals.length;

        // Load lab tests count
        const labTestsResponse = await fetch(`${backendUrl}/api/lab_tests/`, {
            credentials: 'include'
        });
        const labTestsData = await labTestsResponse.json();
        const labTests = labTestsData.lab_tests || [];
        document.getElementById('total-lab-tests').textContent = labTests.length;

    } catch (error) {
        console.error('Error loading overview stats:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/users/`, {
            credentials: 'include'
        });
        const data = await response.json();
        const users = data.users || [];

        const usersList = document.getElementById('users-list');
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found.</p>';
        } else {
            usersList.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Name</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Email</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Type</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">City</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${user.first_name} ${user.last_name}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${user.user_type}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${user.city || 'N/A'}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">
                                    <button onclick="viewUserDetails(${user.id})">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-list').innerHTML = '<p>Error loading users.</p>';
    }
}

async function loadAppointments() {
    try {
        const response = await fetch(`${backendUrl}/api/appointments/`, {
            credentials: 'include'
        });
        const data = await response.json();
        const appointments = data.appointments || [];

        const appointmentsList = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments found.</p>';
        } else {
            appointmentsList.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Patient</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Doctor</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Date</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Status</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appointments.map(apt => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${apt.patient_name}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${apt.doctor_name || 'N/A'}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${apt.appointment_date} ${apt.appointment_time}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${apt.status}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">
                                    <button onclick="viewAppointmentDetails(${apt.id})">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-list').innerHTML = '<p>Error loading appointments.</p>';
    }
}

async function loadReports() {
    const reportsContent = document.getElementById('reports-content');
    reportsContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h3>Monthly Appointments</h3>
                <canvas id="appointmentsChart" width="300" height="200"></canvas>
            </div>
            <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h3>User Registration Trends</h3>
                <canvas id="usersChart" width="300" height="200"></canvas>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <button onclick="exportData('appointments')">Export Appointments</button>
            <button onclick="exportData('users')">Export Users</button>
        </div>
    `;

    // Simple chart placeholders - in a real app, you'd use Chart.js or similar
    // For now, just show some basic info
    setTimeout(() => {
        const ctx1 = document.getElementById('appointmentsChart').getContext('2d');
        ctx1.fillStyle = '#1976d2';
        ctx1.fillRect(50, 150, 50, 50); // Placeholder bar
        ctx1.fillRect(120, 120, 50, 80);
        ctx1.fillRect(190, 100, 50, 100);

        const ctx2 = document.getElementById('usersChart').getContext('2d');
        ctx2.fillStyle = '#2e7d32';
        ctx2.fillRect(50, 140, 50, 60);
        ctx2.fillRect(120, 110, 50, 90);
        ctx2.fillRect(190, 80, 50, 120);
    }, 100);
}

function loadSystemInfo() {
    const systemInfo = document.getElementById('system-info');
    systemInfo.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
                <h4>Server Status</h4>
                <p>✅ Django Server Running</p>
                <p>✅ Database Connected</p>
            </div>
            <div>
                <h4>Environment</h4>
                <p>Python: 3.9+</p>
                <p>Django: 6.0.3</p>
                <p>Database: SQLite</p>
            </div>
            <div>
                <h4>API Endpoints</h4>
                <p>Auth: /api/auth/</p>
                <p>Hospitals: /api/hospitals/</p>
                <p>Appointments: /api/appointments/</p>
            </div>
        </div>
    `;
}

function viewUserDetails(userId) {
    alert(`View user details for ID: ${userId} - Feature coming soon!`);
}

function viewAppointmentDetails(appointmentId) {
    alert(`View appointment details for ID: ${appointmentId} - Feature coming soon!`);
}

function exportData(type) {
    alert(`Export ${type} data - Feature coming soon!`);
}

function showSection(sectionName) {
    // Hide all sections
    document.getElementById('overview-section').style.display = 'block';
    document.getElementById('users-section').style.display = 'none';
    document.getElementById('appointments-section').style.display = 'none';
    document.getElementById('reports-section').style.display = 'none';
    document.getElementById('system-section').style.display = 'none';

    // Show selected section
    if (sectionName !== 'overview') {
        document.getElementById('overview-section').style.display = 'none';
        document.getElementById(`${sectionName}-section`).style.display = 'block';
    }
}

async function logout() {
    try {
        await fetch(`${backendUrl}/api/auth/logout/`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    window.location.href = 'login.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', checkAuth);