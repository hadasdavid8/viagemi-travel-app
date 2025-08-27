from recommender.models import RecommendedPlace
from django.db import models
from preferences.models import TripPreferences 

class Itinerary(models.Model):
    preference = models.OneToOneField(TripPreferences, on_delete=models.CASCADE, related_name='itinerary', null=True, blank=True) 
    destination = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    total_days = models.IntegerField()
    budget_estimate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Itinerary for {self.destination} ({self.start_date} to {self.end_date})"

class ItineraryDay(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name='days')
    day_number = models.IntegerField()
    date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Day {self.day_number} of {self.itinerary}"

class ItineraryPlace(models.Model):
    TRANSPORT_MODES = (
        ('WALKING', 'Walking'),
        ('DRIVING', 'Driving'),
        ('BICYCLING', 'Bicycling'),
        ('TRANSIT', 'Public Transit'),
    )

    place = models.ForeignKey(RecommendedPlace, on_delete=models.CASCADE)
    itinerary_day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE, related_name='places')
    notes = models.TextField(blank=True, null=True)
    transport_mode = models.CharField(
        max_length=20,
        choices=TRANSPORT_MODES,
        default='WALKING',
        help_text="Mode of transport to reach this place."
    )

    def __str__(self):
        return f"{self.place.name} on Day {self.itinerary_day.day_number}"
