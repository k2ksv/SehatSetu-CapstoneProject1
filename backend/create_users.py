import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sehatsetu.settings')
django.setup()

from accounts.models import User

# Create admin user
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'user_type': 'admin',
        'is_staff': True,
        'is_superuser': True
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print(f'✓ Admin user created: {admin_user.email}')
else:
    admin_user.set_password('admin123')
    admin_user.save()
    print(f'✓ Admin user updated: {admin_user.email}')

# Create doctor user
doctor_user, created = User.objects.get_or_create(
    username='doctor',
    defaults={
        'email': 'doctor@example.com',
        'first_name': 'Dr. John',
        'last_name': 'Smith',
        'user_type': 'doctor',
        'phone_number': '9876543210',
        'city': 'Delhi',
        'is_staff': False,
        'is_superuser': False
    }
)
if created:
    doctor_user.set_password('doctor123')
    doctor_user.save()
    print(f'✓ Doctor user created: {doctor_user.email}')
else:
    doctor_user.set_password('doctor123')
    doctor_user.save()
    print(f'✓ Doctor user updated: {doctor_user.email}')

# Create patient user
patient_user, created = User.objects.get_or_create(
    username='patient',
    defaults={
        'email': 'patient@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'user_type': 'patient',
        'phone_number': '9876543211',
        'city': 'Mumbai',
        'age': 30,
        'gender': 'M',
        'is_staff': False,
        'is_superuser': False
    }
)
if created:
    patient_user.set_password('patient123')
    patient_user.save()
    print(f'✓ Patient user created: {patient_user.email}')
else:
    patient_user.set_password('patient123')
    patient_user.save()
    print(f'✓ Patient user updated: {patient_user.email}')

print('\n--- All Test Users Ready ---')
all_users = User.objects.filter(username__in=['admin', 'doctor', 'patient'])
for user in all_users:
    print(f'Username: {user.username:10} | Email: {user.email:25} | Type: {user.user_type:8}')

print('\n✓ Database is ready for testing!')
