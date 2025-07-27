from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from preferences.models import TripPreferences
from .models import Itinerary
from .serializers import ItinerarySerializer
from .services import generate_itinerary
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework import viewsets

class ItineraryView(APIView):
    def get(self, request, preference_id):
        try:
            preferences = TripPreferences.objects.get(pk=preference_id)
        except TripPreferences.DoesNotExist:
            return Response(
                {'error': 'Trip preferences not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        itinerary = getattr(preferences, 'itinerary', None)

        if not itinerary:
            itinerary = generate_itinerary(preferences)
            itinerary.preference = preferences
            itinerary.save()

        serializer = ItinerarySerializer(itinerary)
        return Response(serializer.data)


@api_view(['GET'])
def get_google_maps_api_key(request):
    return JsonResponse({'apiKey': settings.GOOGLE_API_KEY})
