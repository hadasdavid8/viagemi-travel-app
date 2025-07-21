from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from preferences.models import TripPreferences, TripStyle
from recommender.models import RecommendedPlace

class RecommendationsViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.style = TripStyle.objects.create(key='CULINARY', name='Culinary')

        self.trip_pref = TripPreferences.objects.create(
            destination='Paris',
            start_date='2025-07-20',
            end_date='2025-07-22',
            participants=2,
            pace='MODERATE',
        )
        self.trip_pref.trip_styles.add(self.style)

    @patch('recommender.views.fetch_google_places')
    def test_get_recommendations_success(self, mock_fetch):
        mock_fetch.return_value = [
            RecommendedPlace(
                destination='Paris',
                place_id='mock123',
                name='Fake Place',
                formatted_address='Fake Address',
                latitude=48.8,
                longitude=2.3,
                types=['museum'],
                rating=4.5,
                user_ratings_total=100,
            )
        ]

        url = reverse('recommendations', args=[self.trip_pref.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Fake Place')

    def test_get_recommendations_not_found(self):
        url = reverse('recommendations', args=[999])  # מזהה לא קיים
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
