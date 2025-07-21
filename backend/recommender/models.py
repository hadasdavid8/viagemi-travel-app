from django.db import models

class RecommendedPlace(models.Model):
    destination = models.CharField(max_length=255, help_text="Destination name, e.g., 'Paris' or 'Tokyo'.")
    place_id = models.CharField(max_length=150, unique=True, help_text="Unique Google Place ID.")
    name = models.CharField(max_length=255, help_text="Name of the place.")
    formatted_address = models.CharField(max_length=300, blank=True, null=True, help_text="Formatted full address from Google.")
    latitude = models.FloatField()
    longitude = models.FloatField()
    types = models.JSONField(blank=True, null=True, help_text="List of place types/categories (e.g., ['restaurant', 'museum']).")
    rating = models.FloatField(blank=True, null=True, help_text="Google rating between 0.0 and 5.0.")
    user_ratings_total = models.IntegerField(blank=True, null=True, help_text="Total number of user reviews.")
    opening_hours = models.JSONField(blank=True, null=True, help_text="JSON field of opening hours if available.")
    price_level = models.IntegerField(blank=True, null=True, help_text="Price level from 0 (free) to 4 (expensive).")
    need_reservation = models.BooleanField(default=False, help_text="If the place typically requires reservation.")
    average_visit_duration_minutes = models.IntegerField(blank=True, null=True, help_text="Estimated time people spend there, in minutes.")
    image_url = models.URLField(blank=True, null=True)
    html_attributions = models.JSONField(blank=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True, help_text="When this recommendation was saved.")

    def __str__(self):
        return f"{self.name} ({self.destination})"
