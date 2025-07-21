# itinerary/urls.py
from django.urls import path
from .views import ItineraryView
from .views import get_google_maps_api_key

urlpatterns = [
    path('itinerary/<int:preference_id>/', ItineraryView.as_view(), name='get-itinerary'),
    path('api/google-maps-api-key/', get_google_maps_api_key, name='google-maps-api-key'),
]