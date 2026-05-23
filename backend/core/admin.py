from django.contrib import admin
from .models import Hospital, Doctor, Review, LabTest, LabTestBooking, LabTestReport

admin.site.register(Hospital)
admin.site.register(Doctor)
admin.site.register(Review)
admin.site.register(LabTest)
admin.site.register(LabTestBooking)
admin.site.register(LabTestReport)