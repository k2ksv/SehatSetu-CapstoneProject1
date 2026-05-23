const backendUrl = 'http://127.0.0.1:8000';
let allLabTests = [];
let currentTestId = null;

async function loadLabTests() {
    try {
        const response = await fetch(`${backendUrl}/api/lab_tests/`);
        const data = await response.json();
        allLabTests = data.lab_tests;
        renderLabTests(allLabTests);
    } catch (error) {
        console.error('Error loading lab tests:', error);
        document.getElementById('labtestsGrid').innerHTML = '<div class="no-labtests">Error loading lab tests. Please try again later.</div>';
    }
}

function renderLabTests(labTests) {
    const grid = document.getElementById('labtestsGrid');

    if (labTests.length === 0) {
        grid.innerHTML = '<div class="no-labtests">No lab tests found matching your criteria.</div>';
        return;
    }

    const labTestsHtml = labTests.map(test => `
        <div class="labtest-card">
            <div class="labtest-image">
                ${test.photo ?
                    `<img src="${test.photo}" alt="${test.name}" class="labtest-photo">` :
                    '<div>No Image</div>'
                }
            </div>
            <div class="labtest-info">
                <div class="labtest-name">${test.name}</div>
                <div class="labtest-type">${test.type}</div>
                <div class="labtest-details">
                    <div>🏥 ${test.hospital.name}</div>
                    <div>📍 ${test.hospital.location}</div>
                    ${test.description ? `<div>📋 ${test.description}</div>` : ''}
                    ${test.preparation_instructions ? `<div>⚠️ ${test.preparation_instructions}</div>` : ''}
                </div>
                <div class="labtest-price">₹${test.price}</div>
                <button onclick="openBookingModal(${test.id})" class="book-test-btn">Book Test</button>
            </div>
        </div>
    `).join('');

    grid.innerHTML = labTestsHtml;
}

function filterLabTests() {
    let filtered = [...allLabTests];

    const searchName = document.getElementById('searchName').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    const searchHospital = document.getElementById('searchHospital').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;

    if (searchName) {
        filtered = filtered.filter(t => t.name.toLowerCase().includes(searchName));
    }

    if (filterType) {
        filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchHospital) {
        filtered = filtered.filter(t => t.hospital.name.toLowerCase().includes(searchHospital));
    }

    if (sortBy) {
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    }

    renderLabTests(filtered);
}

function clearFilters() {
    document.getElementById('searchName').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('searchHospital').value = '';
    document.getElementById('sortBy').value = '';
    renderLabTests(allLabTests);
}

function openBookingModal(testId) {
    currentTestId = testId;
    document.getElementById('bookingModal').style.display = 'block';

    // Pre-fill with current user data if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.first_name && currentUser.last_name) {
        document.getElementById('patientName').value = `${currentUser.first_name} ${currentUser.last_name}`;
    }
    if (currentUser.email) {
        document.getElementById('patientEmail').value = currentUser.email;
    }
    if (currentUser.phone_number) {
        document.getElementById('patientPhone').value = currentUser.phone_number;
    }
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
    currentTestId = null;
}

async function submitBooking(event) {
    event.preventDefault();

    const formData = {
        lab_test_id: currentTestId,
        patient_name: document.getElementById('patientName').value,
        patient_email: document.getElementById('patientEmail').value,
        patient_phone: document.getElementById('patientPhone').value,
        appointment_date: document.getElementById('appointmentDate').value,
        appointment_time: document.getElementById('appointmentTime').value,
        notes: document.getElementById('notes').value,
    };

    try {
        const response = await fetch(`${backendUrl}/api/book_lab_test/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
            alert(`Lab test booked successfully! Booking ID: ${result.id}`);
            closeModal();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error booking lab test:', error);
        alert('Error booking lab test. Please try again.');
    }
}

// Event listeners
document.getElementById('bookingForm').addEventListener('submit', submitBooking);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Load lab tests when page loads
loadLabTests();