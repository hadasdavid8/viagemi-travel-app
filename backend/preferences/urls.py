from django.urls import path
from .views import TripPreferencesCreateView, PaceChoicesView, TripStylesListView, HomePage

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('trip-preferences/', TripPreferencesCreateView.as_view(), name='trip-preferences'),
    path('pace-choices/', PaceChoicesView.as_view(), name='pace-choices'),
    path('trip-styles/', TripStylesListView.as_view(), name='trip-styles'),
]
