from django.db import models
from itinerary.models import Itinerary

class Feedback(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.rating} for Itinerary {self.itinerary_id}"
    

