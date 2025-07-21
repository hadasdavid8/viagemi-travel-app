from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'itinerary', 'rating', 'comment', 'created_at']
