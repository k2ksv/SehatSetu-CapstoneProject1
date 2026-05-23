// SehatSetu - Main Application File
// This is the central application logic

class SehatSetuApp {
  constructor() {
    this.currentUser = null;
    this.hospitals = [];
    this.appointments = [];
    this.init();
  }

  // Initialize the application
  init() {
    console.log('SehatSetu Application Initialized');
    this.setupEventListeners();
    this.loadStoredData();
  }

  // Setup event listeners
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.checkUserAuthentication();
    });
  }

  // Check if user is authenticated
  checkUserAuthentication() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      console.log('User authenticated:', this.currentUser.name);
    }
  }

  // Load data from local storage
  loadStoredData() {
    const stored = localStorage.getItem('sehatsetuData');
    if (stored) {
      const data = JSON.parse(stored);
      this.hospitals = data.hospitals || [];
      this.appointments = data.appointments || [];
    }
  }

  // Save data to local storage
  saveData() {
    const data = {
      hospitals: this.hospitals,
      appointments: this.appointments
    };
    localStorage.setItem('sehatsetuData', JSON.stringify(data));
  }

  // User Registration
  registerUser(email, password, name) {
    const user = {
      id: Date.now(),
      email,
      name,
      password, // Note: In production, never store plain passwords
      createdAt: new Date()
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
    console.log('User registered:', name);
    return user;
  }

  // User Login
  loginUser(email, password) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.email === email && user.password === password) {
      this.currentUser = user;
      console.log('User logged in:', email);
      return true;
    }
    console.log('Login failed');
    return false;
  }

  // User Logout
  logoutUser() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    console.log('User logged out');
  }

  // Add hospital
  addHospital(name, location, specialties, rating) {
    const hospital = {
      id: Date.now(),
      name,
      location,
      specialties: specialties.split(',').map(s => s.trim()),
      rating,
      addedAt: new Date()
    };
    this.hospitals.push(hospital);
    this.saveData();
    console.log('Hospital added:', name);
    return hospital;
  }

  // Get all hospitals
  getHospitals() {
    return this.hospitals;
  }

  // Search hospitals by name or specialty
  searchHospitals(query) {
    const lowerQuery = query.toLowerCase();
    return this.hospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(lowerQuery) ||
      hospital.location.toLowerCase().includes(lowerQuery) ||
      hospital.specialties.some(s => s.toLowerCase().includes(lowerQuery))
    );
  }

  // Book appointment
  bookAppointment(hospitalId, date, time, reason) {
    if (!this.currentUser) {
      console.log('User must be logged in to book appointment');
      return null;
    }

    const appointment = {
      id: Date.now(),
      userId: this.currentUser.id,
      hospitalId,
      date,
      time,
      reason,
      status: 'pending',
      bookedAt: new Date()
    };
    this.appointments.push(appointment);
    this.saveData();
    console.log('Appointment booked:', appointment.id);
    return appointment;
  }

  // Get user appointments
  getUserAppointments() {
    if (!this.currentUser) return [];
    return this.appointments.filter(apt => apt.userId === this.currentUser.id);
  }

  // Compare hospitals
  compareHospitals(hospitalIds) {
    return this.hospitals.filter(h => hospitalIds.includes(h.id));
  }
}

// Initialize app globally
const app = new SehatSetuApp();
