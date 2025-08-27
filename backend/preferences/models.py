from django.db import models

TRIP_STYLE_CHOICES = (
    ('CULINARY', 'Culinary'),
    ('HISTORY', 'Historical/Cultural'),
    ('BEACH', 'Beach'),
    ('ADVENTURE', 'Adventure/Extreme'),
    ('NATURE', 'Nature/Hiking'),
    ('RELAXATION', 'Relaxation/Leisure'),
    ('CITY_BREAK', 'City Break'),
    ('ROMANTIC', 'Romantic'),
    ('FAMILY', 'Family'),
    ('LUXURY', 'Luxury'),
    ('BUDGET', 'Budget-friendly'),
    ('ART', 'Art & Galleries'),
    ('NIGHTLIFE', 'Nightlife'),
    ('WILDLIFE', 'Wildlife'),
    ('WINTER_SPORTS', 'Winter Sports'),
    ('ROAD_TRIP', 'Road Trip'),
    ('CRUISE', 'Cruise'),
    ('WELLNESS', 'Wellness/Spa'),
)

class TripStyle(models.Model):
    key = models.CharField(
        max_length=50,
        unique=True,
        choices=TRIP_STYLE_CHOICES,
        help_text="Unique internal key for the trip style (e.g., 'CULINARY')."
    )
    name = models.CharField(
        max_length=50,
        unique=True,
        help_text="Display name for the trip style (e.g., 'Culinary')."
    )

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Trip Style"
        verbose_name_plural = "Trip Styles"
        ordering = ['name']



class TripPreferences(models.Model):
    destination = models.CharField(
        max_length=255,
        help_text="Preferred destination for the trip (e.g., 'Paris', 'Tokyo')."
    )
    start_date = models.DateField(
        blank=True,
        null=True,
        help_text="Preferred start date for the trip."
    )
    end_date = models.DateField(
        blank=True,
        null=True,
        help_text="Preferred end date for the trip."
    )
    trip_styles = models.ManyToManyField(
        TripStyle,
        blank=True,
        help_text="Preferred trip style(s) (select multiple options)."
    )
    participants = models.IntegerField(
        blank=True,
        null=True,
        help_text="Number of participants in the trip (including the user)."
    )
    PACE_CHOICES = (
        ('RELAXED', 'Relaxed'),
        ('MODERATE', 'Moderate'),
        ('FAST', 'Fast/Intense'),
    )
    pace = models.CharField(
        max_length=20,
        choices=PACE_CHOICES,
        default='MODERATE',
        help_text="Preferred pace of the trip."
    )

    @property
    def duration(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days + 1
        return None


    def __str__(self):
        styles = ", ".join([style.name for style in self.trip_styles.all()])
        return f"Preferences for {self.destination} (Styles: {styles if styles else 'None'})"
    class Meta:
        verbose_name = "Trip Preference"
        verbose_name_plural = "Trip Preferences"