from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('preferences.urls')),
    path('', include('recommender.urls')),
    path('', include('itinerary.urls')),
    path('',include('feedback.urls')),
]
