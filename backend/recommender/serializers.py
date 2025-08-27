from rest_framework import serializers
from .models import RecommendedPlace

class RecommendedPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendedPlace
        fields = [
            'id',
            'destination',
            'place_id',
            'name',
            'formatted_address',
            'latitude',
            'longitude',
            'types',
            'rating',
            'user_ratings_total',
            'opening_hours',
            'price_level',
            'need_reservation',
            'average_visit_duration_minutes',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
