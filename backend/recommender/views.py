from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import fetch_google_places
from preferences.models import TripPreferences
from .serializers import RecommendedPlaceSerializer

class RecommendationsView(APIView):
    def get(self, request, preference_id):
        try:
            preferences = TripPreferences.objects.get(pk=preference_id)
        except TripPreferences.DoesNotExist:
            return Response({'error': 'Trip preferences not found.'}, status=status.HTTP_404_NOT_FOUND)

        recommendations = fetch_google_places(preferences)

        sorted_recommendations = sorted(
            recommendations,
            key=lambda place: ((place.rating or 0), (place.user_ratings_total or 0)),
            reverse=True
        )

        serializer = RecommendedPlaceSerializer(sorted_recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
