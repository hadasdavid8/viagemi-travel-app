from rest_framework import serializers
from .models import TripPreferences, TripStyle
from datetime import date

class TripStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripStyle
        fields = ['id', 'key', 'name']

class TripPreferencesSerializer(serializers.ModelSerializer):
    trip_styles = serializers.PrimaryKeyRelatedField(
        queryset=TripStyle.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = TripPreferences

        fields = [
            'id',             
            'destination',   
            'start_date',   
            'end_date',          
            'trip_styles',   
            'participants',  
            'pace',        
        ]

    def validate(self, data):
        start = data.get('start_date')
        end = data.get('end_date')
        participants = data.get('participants')
        trip_styles = data.get('trip_styles')

        if start and end and start > end:
            raise serializers.ValidationError("Start date must be before end date.")

        if start and start < date.today():
            raise serializers.ValidationError("Start date cannot be in the past.")

        if participants is not None and participants < 1:
            raise serializers.ValidationError("Participants must be at least 1.")

        if trip_styles is not None and len(trip_styles) == 0:
            raise serializers.ValidationError("At least one trip style must be selected.")

        return data

