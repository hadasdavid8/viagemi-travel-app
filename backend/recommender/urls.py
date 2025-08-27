from django.urls import path
from .views import RecommendationsView

urlpatterns = [
    path('recommendations/<int:preference_id>/', RecommendationsView.as_view(), name='recommendations'),
]
