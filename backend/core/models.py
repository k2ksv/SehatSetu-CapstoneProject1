from django.db import models

class Hospital(models.Model):
    HOSPITAL_TYPE_CHOICES = [
        ('private', 'Private'),
        ('government', 'Government'),
    ]

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=HOSPITAL_TYPE_CHOICES, default='private')
    beds = models.IntegerField(default=0)
    specialties = models.TextField(blank=True)  # Comma-separated specialties
    facilities = models.TextField(blank=True)  # Comma-separated facilities
    price_range = models.CharField(max_length=50, blank=True)  # e.g., "₹500-₹2000", "₹1000-₹5000"
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    contact_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    photo = models.ImageField(upload_to='hospitals/', blank=True, null=True)

    def __str__(self):
        return self.name

    def get_specialties_list(self):
        return [s.strip() for s in self.specialties.split(',') if s.strip()]

    def get_facilities_list(self):
        return [f.strip() for f in self.facilities.split(',') if f.strip()]

class Doctor(models.Model):
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='doctors/', blank=True, null=True)
    location = models.CharField(max_length=255)
    experience_years = models.IntegerField(default=0)
    specialty = models.CharField(max_length=255)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctors')
    contact_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    qualifications = models.TextField(blank=True)  # Degrees, certifications
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    available_days = models.CharField(max_length=255, blank=True)  # e.g., "Mon-Fri"
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Dr. {self.name} - {self.specialty}"

class Review(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    rating_overall = models.IntegerField()
    cleanliness = models.IntegerField()
    waiting_time = models.IntegerField()
    cost_transparency = models.IntegerField()
    facilities = models.IntegerField()
    comment = models.TextField()

    def __str__(self):
        return f"Review {self.rating_overall}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient_name = models.CharField(max_length=255)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=20)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment with {self.doctor.name} on {self.appointment_date} at {self.appointment_time}"

class LabTest(models.Model):
    TEST_TYPE_CHOICES = [
        ('blood', 'Blood Test'),
        ('urine', 'Urine Test'),
        ('imaging', 'Imaging'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=255)
    photo = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=TEST_TYPE_CHOICES, default='blood')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    preparation_instructions = models.TextField(blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='lab_tests')
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class LabTestBooking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    lab_test = models.ForeignKey(LabTest, on_delete=models.CASCADE)
    patient_name = models.CharField(max_length=255)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=20)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.lab_test.name} by {self.patient_name}"

class LabTestReport(models.Model):
    booking = models.OneToOneField(LabTestBooking, on_delete=models.CASCADE, related_name='report')
    report_date = models.DateTimeField(auto_now_add=True)
    results = models.TextField()  # Detailed test results
    summary = models.TextField(blank=True)  # Brief summary
    doctor_notes = models.TextField(blank=True)  # Doctor's interpretation
    report_file = models.FileField(upload_to='lab_reports/', blank=True, null=True)  # PDF or image file
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ], default='pending')

    def __str__(self):
        return f"Report for {self.booking.lab_test.name} - {self.booking.patient_name}"

