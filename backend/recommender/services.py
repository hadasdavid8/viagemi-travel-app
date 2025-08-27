import requests
import math
import difflib
from django.conf import settings
from .models import RecommendedPlace

GOOGLE_API_KEY = settings.GOOGLE_API_KEY

LARGE_CITIES = {'new york', 'tokyo', 'london', 'los angeles', 'paris'}

def is_similar_place_name(name1, name2, threshold=0.85):
    return difflib.SequenceMatcher(None, name1.lower(), name2.lower()).ratio() >= threshold

def fetch_google_places(trip_preferences):
    destination = trip_preferences.destination.strip()
    existing_places = RecommendedPlace.objects.filter(destination__iexact=destination)

    location = get_coordinates_for_destination(destination)
    if not location:
        return list(existing_places)

    lat, lng = location
    radius_km = 30 if destination.lower() in LARGE_CITIES else 10
    grid_points = generate_grid(lat, lng, radius_km, step_km=3) 

    all_results = []
    for point in grid_points:
        all_results.extend(nearby_search(point))

    queries = [
        f"best things to do in {destination}",
        f"top attractions in {destination}",
        f"must see in {destination}",
        f"{destination} hidden gems",
        f"romantic spots in {destination}",
        f"family friendly activities in {destination}",
        f"local food spots in {destination}",
        f"nature parks near {destination}",
        f"{destination} nightlife hotspots",
        f"cultural experiences in {destination}",
        f"historical sites in {destination}",
        f"outdoor adventures in {destination}",
        f"free events in {destination}",
        f"popular cafes and restaurants in {destination}",
        f"{destination} scenic views",
    ]

    for query in queries:
        all_results.extend(text_search(query))

    unique_places = {place['place_id']: place for place in all_results if 'place_id' in place}.values()

    saved_places = []
    saved_place_names = set() 

    for place in unique_places:
        if not is_place_in_city(place, destination):
            continue
        if place.get('user_ratings_total', 0) < 30:
            continue
        if place.get('rating', 0) < 4.0:
            continue

        name = place.get('name', '').strip()
        if any(is_similar_place_name(name, existing) for existing in saved_place_names):
            continue
 
        obj, created = RecommendedPlace.objects.get_or_create(
            place_id=place['place_id'],
            defaults={
                'destination': destination,
                'name': name,
                'formatted_address': place.get('formatted_address') or place.get('vicinity'),
                'latitude': place['geometry']['location']['lat'],
                'longitude': place['geometry']['location']['lng'],
                'types': place.get('types'),
                'rating': place.get('rating'),
                'user_ratings_total': place.get('user_ratings_total'),
                'price_level': place.get('price_level'),
                'need_reservation': False,
                'average_visit_duration_minutes': None,
                'html_attributions': place.get('html_attributions', []), 
            }
        )
        if created:
            saved_places.append(obj)
            saved_place_names.add(name)

    return list(existing_places) + saved_places


def is_place_in_city(place, destination):
    address = place.get('formatted_address') or place.get('vicinity') or ''
    return destination.lower() in address.lower()

def get_coordinates_for_destination(destination):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": destination, "key": GOOGLE_API_KEY}
    try:
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        if data['status'] == 'OK' and data['results']:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
    except Exception:
        pass
    return None

def nearby_search(location, radius=1500, place_type="tourist_attraction"):
    lat, lng = location
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": place_type,
        "key": GOOGLE_API_KEY,
    }

    all_results = []
    while True:
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        results = data.get('results', [])
        all_results.extend(results)

        next_page_token = data.get('next_page_token')
        if not next_page_token:
            break

        import time
        time.sleep(2)
        params = {
            "pagetoken": next_page_token,
            "key": GOOGLE_API_KEY
        }
    return all_results

def text_search(query):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": query,
        "key": GOOGLE_API_KEY
    }

    all_results = []
    page = 1
    while True:
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        results = data.get('results', [])
        all_results.extend(results)

        next_page_token = data.get('next_page_token')
        if not next_page_token:
            break

        import time
        time.sleep(2)
        params = {"pagetoken": next_page_token, "key": GOOGLE_API_KEY}
        page += 1

    return all_results

def generate_grid(center_lat, center_lng, radius_km, step_km):
    def offset_coords(lat, lng, d_lat, d_lng):
        return lat + d_lat, lng + d_lng

    delta_lat = step_km / 111
    delta_lng = step_km / (111 * math.cos(math.radians(center_lat)))

    num_steps = int(radius_km / step_km)
    grid = []
    for dx in range(-num_steps, num_steps + 1):
        for dy in range(-num_steps, num_steps + 1):
            point = offset_coords(center_lat, center_lng, dx * delta_lat, dy * delta_lng)
            grid.append(point)
    return grid
