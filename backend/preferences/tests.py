from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import TripStyle, TripPreferences


class TripPreferencesTests(TestCase):
   def setUp(self):
    self.style1 = TripStyle.objects.create(key='ROMANTIC', name='Romantic')
    self.style2 = TripStyle.objects.create(key='ADVENTURE', name='Adventure')


    def test_create_trip_preferences(self):
        url = reverse('trip-preferences')
        data = {
            'destination': 'Paris',
            'start_date': '2025-09-10',
            'end_date': '2025-09-15',
            'pace': 'MODERATE',
            'trip_styles': [self.style1.id, self.style2.id]
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TripPreferences.objects.count(), 1)
        self.assertEqual(TripPreferences.objects.first().destination, 'Paris')

    def test_get_pace_choices(self):
        url = reverse('pace-choices')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('pace', response.data[0])
        self.assertTrue(any(choice['pace'] == 'slow' for choice in response.data))

    def test_get_trip_styles(self):
        url = reverse('trip-styles')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], self.style1.name)

