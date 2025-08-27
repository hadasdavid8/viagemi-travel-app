from rest_framework import serializers
from .models import Itinerary, ItineraryDay, ItineraryPlace
from recommender.models import RecommendedPlace


class RecommendedPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendedPlace
        fields = [
            'id', 'name', 'place_id', 'formatted_address',
            'latitude', 'longitude', 'types', 'rating',
            'user_ratings_total'
        ]


class ItineraryPlaceSerializer(serializers.ModelSerializer):
    place = RecommendedPlaceSerializer()

    class Meta:
        model = ItineraryPlace
        fields = [
            'id',
            'place',
            'notes',
            'transport_mode',
        ]


class ItineraryDaySerializer(serializers.ModelSerializer):
    places = ItineraryPlaceSerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = [
            'id',
            'day_number',
            'date',
            'places',
        ]


class ItinerarySerializer(serializers.ModelSerializer):
    days = ItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            'id',
            'destination',
            'start_date',
            'end_date',
            'total_days',
            'budget_estimate',
            'notes',
            'days',
        ]
