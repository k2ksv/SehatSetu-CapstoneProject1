from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.db.models import Avg
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
import json
from accounts.models import User
from django.db import IntegrityError
from .models import Review, Hospital, Doctor, Appointment, LabTest, LabTestBooking, LabTestReport

def home(request):
    return HttpResponse(
        "<h1>SehatSetu backend is running</h1>"
        "<p>Use <a href='/api/hospitals/'>/api/hospitals/</a> to access hospital data.</p>",
        content_type='text/html'
    )

def hospital_detail(request, hospital_id):
    hospital = Hospital.objects.get(id=hospital_id)

    reviews = Review.objects.filter(hospital=hospital)

    avg_rating = reviews.aggregate(avg=Avg('rating_overall'))['avg']
    hospital.rating_avg = round(avg_rating, 1) if avg_rating else 0

    return render(request, "hospital_detail.html", {
        "hospital": hospital,
        "reviews": reviews
    })

@require_GET
def hospitals_list(request):
    """API endpoint to get list of hospitals with optional filtering"""
    hospitals = Hospital.objects.all()

    # Filtering
    hospital_type = request.GET.get('type')
    if hospital_type in ['private', 'government']:
        hospitals = hospitals.filter(type=hospital_type)

    location = request.GET.get('location')
    if location:
        hospitals = hospitals.filter(location__icontains=location)

    # Convert to list of dicts
    hospitals_data = []
    for hospital in hospitals:
        hospitals_data.append({
            'id': hospital.id,
            'name': hospital.name,
            'location': hospital.location,
            'type': hospital.type,
            'beds': hospital.beds,
            'specialties': hospital.get_specialties_list(),
            'facilities': hospital.get_facilities_list(),
            'price_range': hospital.price_range,
            'rating': float(hospital.rating),
            'contact_number': hospital.contact_number,
            'address': hospital.address,
            'photo': request.build_absolute_uri(hospital.photo.url) if hospital.photo else None,
        })

    return JsonResponse({'hospitals': hospitals_data})

@require_GET
def compare_hospitals(request):
    """API endpoint to get data for specific hospitals for comparison"""
    hospital_ids = request.GET.getlist('ids[]')
    if not hospital_ids or len(hospital_ids) > 3:
        return JsonResponse({'error': 'Please provide 1-3 hospital IDs'}, status=400)

    try:
        hospitals = Hospital.objects.filter(id__in=hospital_ids)
        hospitals_data = []
        for hospital in hospitals:
            hospitals_data.append({
                'id': hospital.id,
                'name': hospital.name,
                'location': hospital.location,
                'type': hospital.type,
                'beds': hospital.beds,
                'specialties': hospital.get_specialties_list(),
                'facilities': hospital.get_facilities_list(),
                'price_range': hospital.price_range,
                'rating': float(hospital.rating),
                'contact_number': hospital.contact_number,
                'address': hospital.address,
                'photo': request.build_absolute_uri(hospital.photo.url) if hospital.photo else None,
            })
        return JsonResponse({'hospitals': hospitals_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_GET
def doctors_list(request):
    """API endpoint to get list of doctors with optional filtering"""
    doctors = Doctor.objects.select_related('hospital').all()

    # Filtering
    specialty = request.GET.get('specialty')
    if specialty:
        doctors = doctors.filter(specialty__icontains=specialty)

    location = request.GET.get('location')
    if location:
        doctors = doctors.filter(location__icontains=location)

    hospital_id = request.GET.get('hospital_id')
    if hospital_id:
        doctors = doctors.filter(hospital_id=hospital_id)

    # Convert to list of dicts
    doctors_data = []
    for doctor in doctors:
        doctors_data.append({
            'id': doctor.id,
            'name': doctor.name,
            'photo': request.build_absolute_uri(doctor.photo.url) if doctor.photo else None,
            'location': doctor.location,
            'experience_years': doctor.experience_years,
            'specialty': doctor.specialty,
            'hospital': {
                'id': doctor.hospital.id,
                'name': doctor.hospital.name,
                'location': doctor.hospital.location,
            },
            'contact_number': doctor.contact_number,
            'email': doctor.email,
            'qualifications': doctor.qualifications,
            'rating': float(doctor.rating),
            'available_days': doctor.available_days,
            'consultation_fee': float(doctor.consultation_fee),
        })

    return JsonResponse({'doctors': doctors_data})

@require_GET
def doctor_detail_api(request, doctor_id):
    doctor = Doctor.objects.select_related('hospital').get(id=doctor_id)
    return JsonResponse({
        'id': doctor.id,
        'name': doctor.name,
        'photo': request.build_absolute_uri(doctor.photo.url) if doctor.photo else None,
        'location': doctor.location,
        'experience_years': doctor.experience_years,
        'specialty': doctor.specialty,
        'hospital': {
            'id': doctor.hospital.id,
            'name': doctor.hospital.name,
            'location': doctor.hospital.location,
        },
        'contact_number': doctor.contact_number,
        'email': doctor.email,
        'qualifications': doctor.qualifications,
        'rating': float(doctor.rating),
        'available_days': doctor.available_days,
        'consultation_fee': float(doctor.consultation_fee),
    })


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body)
    except Exception:
        data = request.POST

    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required.'}, status=400)

    # Try to authenticate with email as username first, then check if email exists
    user = authenticate(request, username=email, password=password)
    if user is None:
        # Try to find user by email and authenticate with username
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass

    if user is not None:
        login(request, user)
        return JsonResponse({
            'success': True,
            'user_type': user.user_type,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'phone_number': user.phone_number,
                'city': user.city,
            }
        })
    else:
        return JsonResponse({'error': 'Invalid credentials.'}, status=400)

@csrf_exempt
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    logout(request)
    return JsonResponse({'success': True})

@login_required
def current_user_view(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'user_type': user.user_type,
        'phone_number': user.phone_number,
        'city': user.city,
        'age': user.age,
        'gender': user.gender,
        'address': user.address,
    })

@login_required
def users_list(request):
    if request.user.user_type != 'admin':
        return JsonResponse({'error': 'Access denied. Admin only.'}, status=403)

    users = User.objects.all()
    users_data = []
    for user in users:
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user.user_type,
            'phone_number': user.phone_number,
            'city': user.city,
            'date_created': user.date_created.isoformat(),
        })

    return JsonResponse({'users': users_data})


@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body)
    except Exception:
        data = request.POST

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    phone_number = data.get('phone') or data.get('phone_number', '')
    city = data.get('city', '')

    if not name or not email or not password:
        return JsonResponse({'error': 'Name, email, and password are required.'}, status=400)

    # Check for existing user by email or username (case-insensitive)
    if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username__iexact=email).exists():
        return JsonResponse({'error': 'A user with that email already exists.'}, status=400)

    first_name, *rest = name.split()
    last_name = ' '.join(rest) if rest else ''

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type='patient',
        )
        user.phone_number = phone_number or ''
        user.city = city or ''
        user.save()
        return JsonResponse({'success': True, 'id': user.id})
    except IntegrityError:
        return JsonResponse({'error': 'A user with that email or username already exists.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body)
    except Exception:
        data = request.POST

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    phone_number = data.get('phone') or data.get('phone_number', '')
    city = data.get('city', '')

    if not name or not email or not password:
        return JsonResponse({'error': 'Name, email, and password are required.'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'A user with that email already exists.'}, status=400)

    first_name, *rest = name.split()
    last_name = ' '.join(rest) if rest else ''

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type='patient',
        )
        user.phone_number = phone_number or ''
        user.city = city or ''
        user.save()
        return JsonResponse({'success': True, 'id': user.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def doctor_detail(request, doctor_id):
    doctor = Doctor.objects.select_related('hospital').get(id=doctor_id)

    return render(request, "doctor_detail.html", {
        "doctor": doctor,
    })

def add_review(request):
    if request.method == "POST":
        hospital = Hospital.objects.get(id=request.POST.get("hospital_id"))

        Review.objects.create(
            hospital=hospital,
            rating_overall=request.POST.get("rating_overall"),
            cleanliness=request.POST.get("cleanliness"),
            waiting_time=request.POST.get("waiting_time"),
            cost_transparency=request.POST.get("cost_transparency"),
            facilities=request.POST.get("facilities"),
            comment=request.POST.get("comment"),
        )

    return redirect(f"/hospital/{request.POST.get('hospital_id')}/")

@csrf_exempt
def add_hospital(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            data = json.loads(request.body)

        hospital = Hospital.objects.create(
            name=data.get('name', '').strip(),
            location=data.get('location', '').strip(),
            type=data.get('type', 'private'),
            beds=int(data.get('beds', 0) or 0),
            specialties=data.get('specialties', '').strip(),
            facilities=data.get('facilities', '').strip(),
            price_range=data.get('price_range', '').strip(),
            rating=float(data.get('rating', 0.0) or 0.0),
            contact_number=data.get('contact_number', '').strip(),
            address=data.get('address', '').strip(),
            photo=request.FILES.get('photo') if request.FILES.get('photo') else None,
        )
        return JsonResponse({'success': True, 'id': hospital.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def add_doctor(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            data = json.loads(request.body)

        hospital_id_raw = data.get('hospital_id', '')
        try:
            hospital_id = int(hospital_id_raw or 0)
        except (TypeError, ValueError):
            return JsonResponse({'error': 'A valid hospital_id is required.'}, status=400)

        if hospital_id <= 0:
            return JsonResponse({'error': 'A valid hospital_id is required.'}, status=400)

        hospital = Hospital.objects.get(id=hospital_id)

        doctor = Doctor.objects.create(
            name=data.get('name', '').strip(),
            location=data.get('location', '').strip(),
            experience_years=int(data.get('experience_years', 0) or 0),
            specialty=data.get('specialty', '').strip(),
            hospital=hospital,
            contact_number=data.get('contact_number', '').strip(),
            email=data.get('email', '').strip(),
            qualifications=data.get('qualifications', '').strip(),
            rating=float(data.get('rating', 0.0) or 0.0),
            available_days=data.get('available_days', '').strip(),
            consultation_fee=float(data.get('consultation_fee', 0.0) or 0.0),
            photo=request.FILES.get('photo') if request.FILES.get('photo') else None,
        )
        return JsonResponse({'success': True, 'id': doctor.id})
    except Hospital.DoesNotExist:
        return JsonResponse({'error': 'Hospital ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_hospital(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            data = json.loads(request.body)

        hospital_id_raw = data.get('hospital_id', '')
        try:
            hospital_id = int(hospital_id_raw or 0)
        except (TypeError, ValueError):
            return JsonResponse({'error': 'A valid hospital_id is required.'}, status=400)

        if hospital_id <= 0:
            return JsonResponse({'error': 'A valid hospital_id is required.'}, status=400)

        hospital = Hospital.objects.get(id=hospital_id)
        hospital.delete()
        return JsonResponse({'success': True})
    except Hospital.DoesNotExist:
        return JsonResponse({'error': 'Hospital ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_doctor(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            data = json.loads(request.body)

        doctor_id = int(data.get('doctor_id', 0) or 0)
        doctor = Doctor.objects.get(id=doctor_id)
        doctor.delete()
        return JsonResponse({'success': True})
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def book_appointment(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        doctor_id = int(data.get('doctor_id', 0) or 0)
        doctor = Doctor.objects.get(id=doctor_id)

        appointment = Appointment.objects.create(
            doctor=doctor,
            patient_name=data.get('patient_name', '').strip(),
            patient_email=data.get('patient_email', '').strip(),
            patient_phone=data.get('patient_phone', '').strip(),
            appointment_date=data.get('appointment_date'),
            appointment_time=data.get('appointment_time'),
            reason=data.get('reason', '').strip(),
        )

        return JsonResponse({
            'success': True,
            'id': appointment.id,
            'doctor': doctor.name,
            'appointment_date': str(appointment.appointment_date),
            'appointment_time': str(appointment.appointment_time),
        })
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@login_required
@require_GET
def appointments_list(request):
    user = request.user
    appointments = Appointment.objects.select_related('doctor', 'doctor__hospital').all()

    # Filter based on user type
    if user.user_type == 'patient':
        appointments = appointments.filter(patient_email__iexact=user.email)
    elif user.user_type == 'doctor':
        # For doctors, we need to match by doctor name or add a doctor field to Appointment model
        # For now, filter by doctor's email if available, or show all (admin can manage)
        appointments = appointments.filter(doctor__email__iexact=user.email)
    # Admin sees all appointments

    result = []
    for apt in appointments:
        result.append({
            'id': apt.id,
            'doctor': {
                'id': apt.doctor.id,
                'name': apt.doctor.name,
            } if apt.doctor else None,
            'doctor_name': apt.doctor.name if apt.doctor else 'Not assigned',
            'hospital': {
                'id': apt.doctor.hospital.id,
                'name': apt.doctor.hospital.name,
            } if apt.doctor and apt.doctor.hospital else None,
            'patient_name': apt.patient_name,
            'patient_email': apt.patient_email,
            'patient_phone': apt.patient_phone,
            'appointment_date': str(apt.appointment_date),
            'appointment_time': str(apt.appointment_time),
            'reason': apt.reason,
            'status': apt.status,
            'created_at': apt.created_at.isoformat(),
        })

    return JsonResponse({'appointments': result})

@require_GET
def lab_tests_list(request):
    """API endpoint to get list of lab tests with optional filtering"""
    lab_tests = LabTest.objects.select_related('hospital').filter(available=True)

    # Filtering
    hospital_id = request.GET.get('hospital_id')
    if hospital_id:
        lab_tests = lab_tests.filter(hospital_id=hospital_id)

    test_type = request.GET.get('type')
    if test_type in ['blood', 'urine', 'imaging', 'other']:
        lab_tests = lab_tests.filter(type=test_type)

    # Convert to list of dicts
    lab_tests_data = []
    for test in lab_tests:
        lab_tests_data.append({
            'id': test.id,
            'name': test.name,
            'photo': test.photo,
            'description': test.description,
            'type': test.type,
            'price': float(test.price),
            'preparation_instructions': test.preparation_instructions,
            'hospital': {
                'id': test.hospital.id,
                'name': test.hospital.name,
                'location': test.hospital.location,
            },
            'available': test.available,
        })

    return JsonResponse({'lab_tests': lab_tests_data})

@csrf_exempt
def book_lab_test(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        lab_test_id = int(data.get('lab_test_id', 0) or 0)
        lab_test = LabTest.objects.get(id=lab_test_id)

        booking = LabTestBooking.objects.create(
            lab_test=lab_test,
            patient_name=data.get('patient_name', '').strip(),
            patient_email=data.get('patient_email', '').strip(),
            patient_phone=data.get('patient_phone', '').strip(),
            appointment_date=data.get('appointment_date'),
            appointment_time=data.get('appointment_time'),
            notes=data.get('notes', '').strip(),
        )

        return JsonResponse({
            'success': True,
            'id': booking.id,
            'lab_test': lab_test.name,
            'appointment_date': str(booking.appointment_date),
            'appointment_time': str(booking.appointment_time),
        })
    except LabTest.DoesNotExist:
        return JsonResponse({'error': 'Lab test ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@login_required
@require_GET
def lab_test_bookings_list(request):
    user = request.user
    bookings = LabTestBooking.objects.select_related('lab_test', 'lab_test__hospital').all()

    # Filter based on user type
    if user.user_type == 'patient':
        bookings = bookings.filter(patient_email__iexact=user.email)
    # Doctors and admins can see all bookings for now

    result = []
    for booking in bookings:
        # Check if report exists
        try:
            report = LabTestReport.objects.get(booking=booking)
            has_report = True
            report_data = {
                'id': report.id,
                'results': report.results,
                'summary': report.summary,
                'doctor_notes': report.doctor_notes,
                'status': report.status,
                'report_file': request.build_absolute_uri(report.report_file.url) if report.report_file else None,
            }
        except LabTestReport.DoesNotExist:
            has_report = False
            report_data = None

        result.append({
            'id': booking.id,
            'lab_test': {
                'id': booking.lab_test.id,
                'name': booking.lab_test.name,
                'type': booking.lab_test.type,
                'price': float(booking.lab_test.price),
            },
            'hospital': {
                'id': booking.lab_test.hospital.id,
                'name': booking.lab_test.hospital.name,
            },
            'patient_name': booking.patient_name,
            'patient_email': booking.patient_email,
            'patient_phone': booking.patient_phone,
            'appointment_date': str(booking.appointment_date),
            'appointment_time': str(booking.appointment_time),
            'status': booking.status,
            'notes': booking.notes,
            'created_at': booking.created_at.isoformat(),
            'report': report_data,
        })

    return JsonResponse({'bookings': result})

@csrf_exempt
def add_lab_test_report(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            data = json.loads(request.body)

        booking_id = int(data.get('booking_id', 0) or 0)
        booking = LabTestBooking.objects.get(id=booking_id)

        # Check if report already exists
        if hasattr(booking, 'report'):
            return JsonResponse({'error': 'Report already exists for this booking.'}, status=400)

        report = LabTestReport.objects.create(
            booking=booking,
            results=data.get('results', '').strip(),
            summary=data.get('summary', '').strip(),
            doctor_notes=data.get('doctor_notes', '').strip(),
            status=data.get('status', 'completed'),
            report_file=request.FILES.get('report_file') if request.FILES.get('report_file') else None,
        )

        # Update booking status to completed
        booking.status = 'completed'
        booking.save()

        return JsonResponse({
            'success': True,
            'id': report.id,
            'booking_id': booking.id,
        })
    except LabTestBooking.DoesNotExist:
        return JsonResponse({'error': 'Lab test booking ID not found.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_GET
def lab_test_reports_list(request):
    booking_id = request.GET.get('booking_id')
    patient_email = request.GET.get('patient_email')
    reports = LabTestReport.objects.select_related('booking', 'booking__lab_test', 'booking__lab_test__hospital').all()

    if booking_id:
        reports = reports.filter(booking_id=booking_id)
    if patient_email:
        reports = reports.filter(booking__patient_email__iexact=patient_email)

    result = []
    for report in reports:
        result.append({
            'id': report.id,
            'booking': {
                'id': report.booking.id,
                'lab_test': {
                    'id': report.booking.lab_test.id,
                    'name': report.booking.lab_test.name,
                    'type': report.booking.lab_test.type,
                },
                'hospital': {
                    'id': report.booking.lab_test.hospital.id,
                    'name': report.booking.lab_test.hospital.name,
                },
                'patient_name': report.booking.patient_name,
                'patient_email': report.booking.patient_email,
                'appointment_date': str(report.booking.appointment_date),
            },
            'report_date': report.report_date.isoformat(),
            'results': report.results,
            'summary': report.summary,
            'doctor_notes': report.doctor_notes,
            'report_file': report.report_file.url if report.report_file else None,
            'status': report.status,
        })

    return JsonResponse({'reports': result})
    