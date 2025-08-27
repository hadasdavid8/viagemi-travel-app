from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date
from .models import Feedback
from itinerary.models import Itinerary
from preferences.models import TripPreferences

class FeedbackCreateAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('submit-feedback')

        self.trip_preferences = TripPreferences.objects.create(
            destination="Test Destination",
            start_date=date(2025, 9, 10),
            end_date=date(2025, 9, 15),
            participants=2,
            pace='MODERATE',
        )

        self.itinerary = Itinerary.objects.create(
            preference=self.trip_preferences,
            destination="Test Destination",
            start_date=date(2025, 9, 10),
            end_date=date(2025, 9, 15),
            total_days=6,
            budget_estimate=1000.00,
            notes="Test notes",
        )

        self.valid_data = {
            "itinerary": self.itinerary.id,
            "rating": 5,
            "comment": "This is a test feedback"
        }

    def test_create_feedback_success(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Feedback.objects.count(), 1)
        feedback = Feedback.objects.first()
        self.assertEqual(feedback.itinerary.id, self.valid_data['itinerary'])
        self.assertEqual(feedback.rating, self.valid_data['rating'])
        self.assertEqual(feedback.comment, self.valid_data['comment'])

    def test_create_feedback_missing_fields(self):
        invalid_data = {
            "itinerary": self.itinerary.id,
        }
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)
