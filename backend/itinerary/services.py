# itinerary/services.py
from geopy.distance import geodesic
from recommender.models import RecommendedPlace
from itinerary.models import Itinerary, ItineraryDay, ItineraryPlace
from preferences.models import TripPreferences
from collections import defaultdict, deque

GOOGLE_TYPE_TO_TRIP_STYLE = {
    'restaurant': 'CULINARY', 'food': 'CULINARY', 'cafe': 'CULINARY',
    'bakery': 'CULINARY', 'bar': 'NIGHTLIFE', 'meal_takeaway': 'CULINARY',
    'meal_delivery': 'CULINARY', 'museum': 'HISTORY', 'art_gallery': 'ART',
    'church': 'HISTORY', 'synagogue': 'HISTORY', 'mosque': 'HISTORY',
    'hindu_temple': 'HISTORY', 'place_of_worship': 'HISTORY', 'cemetery': 'HISTORY',
    'library': 'HISTORY', 'city_hall': 'HISTORY', 'stadium': 'HISTORY',
    'tourist_attraction': 'HISTORY', 'beach': 'BEACH', 'marina': 'BEACH',
    'pier': 'BEACH', 'hiking': 'ADVENTURE', 'campground': 'ADVENTURE',
    'park': 'NATURE', 'amusement_park': 'FAMILY', 'theme_park': 'FAMILY',
    'water_park': 'FAMILY', 'ski_resort': 'WINTER_SPORTS', 'bowling_alley': 'ADVENTURE',
    'casino': 'LUXURY', 'race_track': 'ADVENTURE', 'natural_feature': 'NATURE',
    'national_park': 'NATURE', 'zoo': 'WILDLIFE', 'aquarium': 'WILDLIFE',
    'wildlife_refuge': 'WILDLIFE', 'forest': 'NATURE', 'mountain': 'NATURE',
    'lake': 'NATURE', 'river': 'NATURE', 'waterfall': 'NATURE',
    'garden': 'NATURE', 'botanical_garden': 'NATURE', 'scenic_viewpoint': 'NATURE',
    'spa': 'WELLNESS', 'health': 'WELLNESS', 'beauty_salon': 'WELLNESS',
    'hair_care': 'WELLNESS', 'massage': 'WELLNESS', 'sauna': 'WELLNESS',
    'shopping_mall': 'CITY_BREAK', 'store': 'CITY_BREAK', 'clothing_store': 'CITY_BREAK',
    'department_store': 'CITY_BREAK', 'book_store': 'CITY_BREAK', 'electronics_store': 'CITY_BREAK',
    'jewelry_store': 'CITY_BREAK', 'supermarket': 'CITY_BREAK', 'market': 'CITY_BREAK',
    'plaza': 'CITY_BREAK', 'town_square': 'CITY_BREAK', 'transit_station': 'CITY_BREAK',
    'viewpoint': 'ROMANTIC', 'night_club': 'NIGHTLIFE', 'movie_theater': 'FAMILY',
    'resort': 'LUXURY', 'luxury_hotel': 'LUXURY', 'convenience_store': 'BUDGET',
    'fast_food': 'BUDGET', 'atm': 'BUDGET', 'bus_station': 'BUDGET',
    'train_station': 'BUDGET', 'gallery': 'ART', 'lounge': 'NIGHTLIFE',
    'snowboard_park': 'WINTER_SPORTS', 'ice_skating_rink': 'WINTER_SPORTS',
    'gas_station': 'ROAD_TRIP', 'rest_area': 'ROAD_TRIP', 'parking': 'ROAD_TRIP',
    'ferry_terminal': 'CRUISE', 'port': 'CRUISE', 'yoga_studio': 'WELLNESS'
}

def map_place_types_to_styles(place_types):
    styles = set()
    if not place_types:
        return set(['OTHER'])
    for t in place_types:
        style = GOOGLE_TYPE_TO_TRIP_STYLE.get(t.lower())
        if style:
            styles.add(style)
    return styles if styles else set(['OTHER'])


def cluster_places_by_style_and_proximity(places, days, places_per_day, max_km=2.0):
    from geopy.distance import geodesic
    from collections import defaultdict, deque

    style_to_places = defaultdict(list)
    for place in places:
        styles = map_place_types_to_styles(place.types)
        main_style = next(iter(styles)) if styles else 'OTHER'
        style_to_places[main_style].append(place)

    def cluster_by_proximity(places_list):
        remaining = places_list.copy()
        clusters = []

        while remaining:
            seed = max(remaining, key=lambda p: (p.rating or 0, p.user_ratings_total or 0))
            cluster = [seed]
            remaining.remove(seed)

            while len(cluster) < places_per_day and remaining:
                last = cluster[-1]
                nearest = sorted(
                    remaining,
                    key=lambda p: geodesic((p.latitude, p.longitude), (last.latitude, last.longitude)).km
                )
                for candidate in nearest:
                    distance = geodesic((last.latitude, last.longitude), (candidate.latitude, candidate.longitude)).km
                    if distance <= max_km:
                        cluster.append(candidate)
                        remaining.remove(candidate)
                        break
                else:
                    break
            clusters.append(cluster)
        return clusters

    style_clusters = {}
    for style, pls in style_to_places.items():
        style_clusters[style] = cluster_by_proximity(pls)


    days_groups = [[] for _ in range(days)]
    days_capacity = [places_per_day] * days

    style_queues = {style: deque(clusters) for style, clusters in style_clusters.items()}

    day_index = 0
    while any(style_queues.values()):
        for style, queue in list(style_queues.items()):
            if not queue:
                del style_queues[style]
                continue
            cluster = queue.popleft()
            capacity = days_capacity[day_index]
            to_add = cluster[:capacity]
            days_groups[day_index].extend(to_add)
            days_capacity[day_index] -= len(to_add)
            day_index = (day_index + 1) % days
            if len(cluster) > capacity:
                queue.append(cluster[capacity:])
            if days_capacity[day_index] <= 0:
                day_index = (day_index + 1) % days

    return days_groups


def generate_itinerary(preferences):
    if not isinstance(preferences, TripPreferences):
        preferences = TripPreferences.objects.get(id=preferences)

    duration = preferences.duration or 1
    pace = {'RELAXED': 2, 'MODERATE': 3, 'FAST': 5}
    per_day = pace.get(preferences.pace, 3)
    needed = duration * per_day

    selected = preferences.trip_styles.values_list('key', flat=True)
    all_places = RecommendedPlace.objects.filter(destination=preferences.destination)

    def matches_styles(p):
        if not p.types or not selected:
            return True
        styles = map_place_types_to_styles(p.types)
        return any(s in styles for s in selected)

    filtered = [p for p in all_places if matches_styles(p)]
    sorted_places = sorted(filtered, key=lambda p: (p.rating or 0, p.user_ratings_total or 0), reverse=True)
    top = sorted_places[:needed]

    grouped = cluster_places_by_style_and_proximity(top, duration, per_day)

    itinerary = Itinerary.objects.create(
        preference=preferences,
        destination=preferences.destination,
        start_date=preferences.start_date,
        end_date=preferences.end_date,
        total_days=duration,
    )

    for i, day_places in enumerate(grouped):
        day = ItineraryDay.objects.create(itinerary=itinerary, day_number=i + 1)
        for j, place in enumerate(day_places):
            mode = 'WALKING'
            if j > 0:
                prev = day_places[j - 1]
                if geodesic((prev.latitude, prev.longitude), (place.latitude, place.longitude)).km > 2:
                    mode = 'TRANSIT'
            ItineraryPlace.objects.create(itinerary_day=day, place=place, transport_mode=mode)

    return itinerary
