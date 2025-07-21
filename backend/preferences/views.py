from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripPreferencesSerializer, TripStyleSerializer
from .models import TripPreferences , TripStyle

class TripPreferencesCreateView(APIView):
    def post(self, request):
        serializer = TripPreferencesSerializer(data=request.data)
        if serializer.is_valid():
            preferences = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaceChoicesView(APIView):
    def get(self, request):
        choices = [
            {'value': choice[0], 'label': choice[1]}
            for choice in TripPreferences.PACE_CHOICES
        ]
        return Response(choices)
    
class TripStylesListView(APIView):
    def get(self, request):
        styles = TripStyle.objects.all()
        serializer = TripStyleSerializer(styles, many=True)
        return Response(serializer.data)