from django.contrib import admin
from .models import TripPreferences, TripStyle

admin.site.register(TripPreferences)
admin.site.register(TripStyle)