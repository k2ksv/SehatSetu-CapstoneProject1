const backendUrl = 'http://127.0.0.1:8000';
let currentUser = null;

async function checkAuth() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/current-user/`, {
            credentials: 'include'
        });
        if (response.ok) {
            currentUser = await response.json();
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

    greeting.textContent = `${timeGreeting}, ${currentUser.first_name || 'Patient'}`;

    // Load dashboard data
    loadAppointments();
    loadLabReports();
    loadProfile();
}

async function loadAppointments() {
    try {
        const response = await fetch(`${backendUrl}/api/appointments/?patient_email=${currentUser.email}`, {
            credentials: 'include'
        });
        const data = await response.json();

        const appointments = data.appointments || [];
        const upcomingAppointments = appointments.filter(apt =>
            new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled'
        );

        document.getElementById('upcoming-appointments').textContent = upcomingAppointments.length;

        if (upcomingAppointments.length > 0) {
            const nextApt = upcomingAppointments[0];
            document.getElementById('next-appointment').textContent =
                `Next: ${nextApt.appointment_date} at ${nextApt.appointment_time} with ${nextApt.doctor.name}`;
        }

        // Display appointments list
        const appointmentsList = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments found.</p>';
        } else {
            appointmentsList.innerHTML = appointments.map(apt => `
                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                    <h4>${apt.doctor.name} - ${apt.doctor.specialty}</h4>
                    <p><strong>Date:</strong> ${apt.appointment_date} at ${apt.appointment_time}</p>
                    <p><strong>Hospital:</strong> ${apt.doctor.hospital.name}</p>
                    <p><strong>Status:</strong> ${apt.status}</p>
                    <p><strong>Reason:</strong> ${apt.reason || 'Not specified'}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-list').innerHTML = '<p>Error loading appointments.</p>';
    }
}

async function loadLabReports() {
    try {
        const response = await fetch(`${backendUrl}/api/lab_test_reports/?patient_email=${currentUser.email}`, {
            credentials: 'include'
        });
        const data = await response.json();

        const reports = data.reports || [];
        const pendingReports = reports.filter(report => report.status === 'pending');
        const completedReports = reports.filter(report => report.status === 'completed');

        document.getElementById('pending-reports').textContent = pendingReports.length;
        document.getElementById('completed-tests').textContent = completedReports.length;

        // Display reports list
        const reportsList = document.getElementById('lab-reports-list');
        if (reports.length === 0) {
            reportsList.innerHTML = '<p>No lab reports found.</p>';
        } else {
            reportsList.innerHTML = reports.map(report => `
                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                    <h4>${report.booking.lab_test.name} (${report.booking.lab_test.type})</h4>
                    <p><strong>Hospital:</strong> ${report.booking.hospital.name}</p>
                    <p><strong>Test Date:</strong> ${report.booking.appointment_date}</p>
                    <p><strong>Report Date:</strong> ${new Date(report.report_date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${report.status}</p>
                    ${report.summary ? `<p><strong>Summary:</strong> ${report.summary}</p>` : ''}
                    ${report.doctor_notes ? `<p><strong>Doctor Notes:</strong> ${report.doctor_notes}</p>` : ''}
                    <details>
                        <summary>Full Results</summary>
                        <pre style="white-space: pre-wrap; margin-top: 10px;">${report.results}</pre>
                    </details>
                    ${report.report_file ? `<p><a href="${backendUrl}${report.report_file}" target="_blank">Download Report</a></p>` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading lab reports:', error);
        document.getElementById('lab-reports-list').innerHTML = '<p>Error loading lab reports.</p>';
    }
}

function loadProfile() {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div><strong>Name:</strong> ${currentUser.first_name} ${currentUser.last_name}</div>
            <div><strong>Email:</strong> ${currentUser.email}</div>
            <div><strong>Phone:</strong> ${currentUser.phone_number || 'Not provided'}</div>
            <div><strong>City:</strong> ${currentUser.city || 'Not provided'}</div>
            <div><strong>Age:</strong> ${currentUser.age || 'Not provided'}</div>
            <div><strong>Gender:</strong> ${currentUser.gender || 'Not provided'}</div>
            <div style="grid-column: 1 / -1;"><strong>Address:</strong> ${currentUser.address || 'Not provided'}</div>
        </div>
    `;
}

function showSection(sectionName) {
    // Hide all sections
    document.getElementById('overview-section').style.display = 'grid';
    document.getElementById('appointments-section').style.display = 'none';
    document.getElementById('lab-reports-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'none';

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