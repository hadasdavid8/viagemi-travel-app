import pytest
from itinerary.services import (
    map_place_types_to_styles,
    cluster_places_by_style_and_proximity,
    generate_itinerary,
)
from preferences.models import TripPreferences, TripStyle
from recommender.models import RecommendedPlace
from itinerary.models import Itinerary, ItineraryPlace
from datetime import date


@pytest.mark.django_db
def test_map_place_types_to_styles_basic():
    input_types = ['restaurant', 'museum']
    result = map_place_types_to_styles(input_types)
    assert 'CULINARY' in result
    assert 'HISTORY' in result

    result = map_place_types_to_styles(['unknown_type'])
    assert result == {'OTHER'}

    result = map_place_types_to_styles(None)
    assert result == {'OTHER'}


@pytest.mark.django_db
def test_cluster_places_by_style_and_proximity_simple():
    class DummyPlace:
        def __init__(self, latitude, longitude, rating=5, user_ratings_total=10, types=None):
            self.latitude = latitude
            self.longitude = longitude
            self.rating = rating
            self.user_ratings_total = user_ratings_total
            self.types = types or []

    places = [
        DummyPlace(32.0, 34.0, rating=4.5, types=['restaurant']),
        DummyPlace(32.001, 34.001, rating=4.0, types=['restaurant']),
        DummyPlace(32.1, 34.1, rating=3.0, types=['museum']),
        DummyPlace(32.101, 34.102, rating=4.0, types=['museum']),
    ]

    days = 2
    places_per_day = 2
    clusters = cluster_places_by_style_and_proximity(places, days, places_per_day, max_km=2.0)
    assert len(clusters) == days
    assert all(len(day_group) <= places_per_day for day_group in clusters)
    all_clustered = sum(clusters, [])
    assert set(all_clustered) == set(places)


@pytest.mark.django_db
def test_generate_itinerary_creates_models():
    ts, _ = TripStyle.objects.get_or_create(key='CULINARY', defaults={'name': 'Culinary'})

    prefs = TripPreferences.objects.create(
        destination='TestCity',
        start_date=date(2025, 1, 1),
        end_date=date(2025, 1, 2),
        pace='MODERATE',
        participants=1,
    )
    prefs.trip_styles.add(ts)

    RecommendedPlace.objects.create(
        destination='TestCity',
        place_id='abc123',
        name='Test Place 1',
        latitude=32.0,
        longitude=34.0,
        types=['restaurant'],
        rating=4.5,
        user_ratings_total=100,
    )
    RecommendedPlace.objects.create(
        destination='TestCity',
        place_id='abc124',
        name='Test Place 2',
        latitude=32.01,
        longitude=34.01,
        types=['museum'],
        rating=4.0,
        user_ratings_total=80,
    )

    itinerary = generate_itinerary(prefs)

    assert isinstance(itinerary, Itinerary)
    assert itinerary.total_days == prefs.duration
    assert itinerary.destination == prefs.destination
    assert itinerary.days.count() == prefs.duration

    for day in itinerary.days.all():
        places = day.itineraryplace_set.all()
        assert places.count() > 0

    places = ItineraryPlace.objects.filter(itinerary_day__itinerary=itinerary)
    assert places.exists()
