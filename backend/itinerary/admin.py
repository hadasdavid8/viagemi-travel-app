from django.contrib import admin
from .models import Itinerary, ItineraryDay, ItineraryPlace

admin.site.register(Itinerary)
admin.site.register(ItineraryDay)
admin.site.register(ItineraryPlace)