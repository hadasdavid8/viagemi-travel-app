from rest_framework import generics
from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackCreateAPIView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
