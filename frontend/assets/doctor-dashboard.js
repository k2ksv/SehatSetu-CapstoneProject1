const backendUrl = 'http://127.0.0.1:8000';
let currentUser = null;

async function checkAuth() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/current-user/`, {
            credentials: 'include'
        });
        if (response.ok) {
            currentUser = await response.json();
            if (currentUser.user_type !== 'doctor') {
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

    greeting.textContent = `${timeGreeting}, Dr. ${currentUser.first_name || 'Doctor'}`;

    // Load dashboard data
    loadAppointments();
    loadLabReportsManagement();
    loadProfile();
}

async function loadAppointments() {
    try {
        // Load all appointments for this doctor
        const response = await fetch(`${backendUrl}/api/appointments/`, {
            credentials: 'include'
        });
        const data = await response.json();

        const appointments = data.appointments || [];
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.appointment_date === today);

        document.getElementById('today-appointments').textContent = todayAppointments.length;

        if (todayAppointments.length > 0) {
            const nextApt = todayAppointments.find(apt => apt.status === 'confirmed') || todayAppointments[0];
            document.getElementById('next-appointment').textContent =
                `Next: ${nextApt.appointment_time} with ${nextApt.patient_name}`;
        }

        // Get unique patients this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthlyAppointments = appointments.filter(apt =>
            new Date(apt.appointment_date) >= thisMonth
        );
        const uniquePatients = new Set(monthlyAppointments.map(apt => apt.patient_email));
        document.getElementById('total-patients').textContent = uniquePatients.size;

        // Display appointments list
        const appointmentsList = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments found.</p>';
        } else {
            appointmentsList.innerHTML = appointments.map(apt => `
                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4>${apt.patient_name}</h4>
                        <span class="status-badge status-${apt.status}">${apt.status}</span>
                    </div>
                    <p><strong>Date:</strong> ${apt.appointment_date} at ${apt.appointment_time}</p>
                    <p><strong>Email:</strong> ${apt.patient_email}</p>
                    <p><strong>Phone:</strong> ${apt.patient_phone}</p>
                    <p><strong>Reason:</strong> ${apt.reason || 'Not specified'}</p>
                    <div style="margin-top: 10px;">
                        <button onclick="updateAppointmentStatus(${apt.id}, 'confirmed')" style="margin-right: 10px;">Confirm</button>
                        <button onclick="updateAppointmentStatus(${apt.id}, 'completed')">Complete</button>
                        <button onclick="updateAppointmentStatus(${apt.id}, 'cancelled')" style="background: #f44336; color: white;">Cancel</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-list').innerHTML = '<p>Error loading appointments.</p>';
    }
}

async function updateAppointmentStatus(appointmentId, status) {
    // This would require a backend endpoint to update appointment status
    alert(`Update appointment ${appointmentId} to ${status} - Feature coming soon!`);
}

async function loadLabReportsManagement() {
    try {
        // Load lab test bookings that need reports
        const response = await fetch(`${backendUrl}/api/lab_test_bookings/`, {
            credentials: 'include'
        });
        const data = await response.json();

        const bookings = data.bookings || [];
        const pendingReports = bookings.filter(booking => !booking.report);

        document.getElementById('pending-reports').textContent = pendingReports.length;

        // Display lab reports management
        const reportsManagement = document.getElementById('lab-reports-management');
        if (bookings.length === 0) {
            reportsManagement.innerHTML = '<p>No lab test bookings found.</p>';
        } else {
            reportsManagement.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h3>Pending Reports (${pendingReports.length})</h3>
                    ${pendingReports.map(booking => `
                        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                            <h4>Booking #${booking.id} - ${booking.lab_test.name}</h4>
                            <p><strong>Patient:</strong> ${booking.patient_name} (${booking.patient_email})</p>
                            <p><strong>Test Date:</strong> ${booking.appointment_date}</p>
                            <p><strong>Hospital:</strong> ${booking.hospital.name}</p>
                            <button onclick="openReportForm(${booking.id})">Add Report</button>
                        </div>
                    `).join('')}
                </div>
                <div id="report-form" style="display: none; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h3>Add Lab Test Report</h3>
                    <form id="addReportForm">
                        <input type="hidden" id="reportBookingId">
                        <div style="margin-bottom: 10px;">
                            <label>Results:</label><br>
                            <textarea id="reportResults" rows="6" style="width: 100%;"></textarea>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label>Summary:</label><br>
                            <textarea id="reportSummary" rows="2" style="width: 100%;"></textarea>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label>Doctor Notes:</label><br>
                            <textarea id="reportDoctorNotes" rows="3" style="width: 100%;"></textarea>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label>Report File:</label><br>
                            <input type="file" id="reportFile" accept=".pdf,image/*">
                        </div>
                        <button type="submit">Submit Report</button>
                        <button type="button" onclick="closeReportForm()">Cancel</button>
                    </form>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading lab reports management:', error);
        document.getElementById('lab-reports-management').innerHTML = '<p>Error loading lab reports management.</p>';
    }
}

function openReportForm(bookingId) {
    document.getElementById('reportBookingId').value = bookingId;
    document.getElementById('report-form').style.display = 'block';
    document.getElementById('addReportForm').addEventListener('submit', submitReport);
}

function closeReportForm() {
    document.getElementById('report-form').style.display = 'none';
    document.getElementById('addReportForm').reset();
}

async function submitReport(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('booking_id', document.getElementById('reportBookingId').value);
    formData.append('results', document.getElementById('reportResults').value);
    formData.append('summary', document.getElementById('reportSummary').value);
    formData.append('doctor_notes', document.getElementById('reportDoctorNotes').value);
    formData.append('status', 'completed');

    const fileInput = document.getElementById('reportFile');
    if (fileInput.files.length > 0) {
        formData.append('report_file', fileInput.files[0]);
    }

    try {
        const response = await fetch(`${backendUrl}/api/add_lab_test_report/`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            alert('Report added successfully!');
            closeReportForm();
            loadLabReportsManagement();
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('Error submitting report.');
    }
}

function loadProfile() {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div><strong>Name:</strong> Dr. ${currentUser.first_name} ${currentUser.last_name}</div>
            <div><strong>Email:</strong> ${currentUser.email}</div>
            <div><strong>Phone:</strong> ${currentUser.phone_number || 'Not provided'}</div>
            <div><strong>City:</strong> ${currentUser.city || 'Not provided'}</div>
            <div><strong>User Type:</strong> ${currentUser.user_type}</div>
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