import os
import requests
from datetime import datetime, timedelta

# Default to NASA's public demo key for prototyping
NASA_API_KEY = os.environ.get("NASA_API_KEY", "DEMO_KEY")

def get_near_earth_objects(days_ahead=3):
    """
    Fetches asteroids approaching Earth within the next few days.
    (Module 5: Near Earth Object Tracker)
    """
    start_date = datetime.now().strftime("%Y-%m-%d")
    end_date = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
    
    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={NASA_API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        asteroids = []
        for date, neos in data.get('near_earth_objects', {}).items():
            for neo in neos:
                asteroids.append({
                    "name": neo.get("name"),
                    "hazard_level": "HIGH" if neo.get("is_potentially_hazardous_asteroid") else "LOW",
                    "close_approach_date": date,
                    "velocity_kmh": round(float(neo["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"]), 2),
                    "miss_distance_km": round(float(neo["close_approach_data"][0]["miss_distance"]["kilometers"]), 2),
                    "estimated_diameter_max_m": round(neo["estimated_diameter"]["meters"]["estimated_diameter_max"], 2)
                })
        
        # Sort by closest distance
        asteroids.sort(key=lambda x: x["miss_distance_km"])
        return asteroids
    except Exception as e:
        print(f"Error fetching NEO data (falling back to mock dataset): {e}")
        # Synthetic fallback data
        return [
            {
                "name": "Apophis (99942)",
                "hazard_level": "HIGH",
                "close_approach_date": "2029-04-13",
                "velocity_kmh": 107388.0,
                "miss_distance_km": 31300.0,
                "estimated_diameter_max_m": 370.0
            },
            {
                "name": "Bennu (101955)",
                "hazard_level": "HIGH",
                "close_approach_date": "2135-09-25",
                "velocity_kmh": 101000.0,
                "miss_distance_km": 300000.0,
                "estimated_diameter_max_m": 510.0
            },
            {
                "name": "2023 DZ2",
                "hazard_level": "LOW",
                "close_approach_date": "2026-03-25",
                "velocity_kmh": 28000.0,
                "miss_distance_km": 174000.0,
                "estimated_diameter_max_m": 93.0
            },
            {
                "name": "2024 JX1",
                "hazard_level": "LOW",
                "close_approach_date": "2026-06-18",
                "velocity_kmh": 45000.0,
                "miss_distance_km": 2500000.0,
                "estimated_diameter_max_m": 120.0
            },
            {
                "name": "2001 FO32",
                "hazard_level": "HIGH",
                "close_approach_date": "2052-03-22",
                "velocity_kmh": 124000.0,
                "miss_distance_km": 2000000.0,
                "estimated_diameter_max_m": 1000.0
            }
        ]
def get_space_weather():
    """
    Fetches Solar Flares (FLR) and Coronal Mass Ejections (CME).
    (Module 4: Space Weather Monitoring)
    """
    start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    flr_url = f"https://api.nasa.gov/DONKI/FLR?startDate={start_date}&api_key={NASA_API_KEY}"
    cme_url = f"https://api.nasa.gov/DONKI/CME?startDate={start_date}&api_key={NASA_API_KEY}"
    
    weather_data = {"solar_flares": [], "coronal_mass_ejections": []}
    
    try:
        flr_res = requests.get(flr_url, timeout=10)
        if flr_res.status_code == 200 and flr_res.json():
            weather_data["solar_flares"] = flr_res.json()
            
        cme_res = requests.get(cme_url, timeout=10)
        if cme_res.status_code == 200 and cme_res.json():
            weather_data["coronal_mass_ejections"] = cme_res.json()
            
    except Exception as e:
        print(f"Error fetching Space Weather data (falling back to mock dataset): {e}")
        weather_data = {
            "solar_flares": [
                {
                    "flrID": "2026-06-16T12:00:00-FLR-001",
                    "instruments": [{"displayName": "GOES-16: EXIS 1.0-8.0"}],
                    "beginTime": "2026-06-16T11:45Z",
                    "peakTime": "2026-06-16T12:00Z",
                    "endTime": "2026-06-16T12:30Z",
                    "classType": "X1.2",
                    "sourceLocation": "N15E30",
                    "activeRegionNum": 13615,
                    "link": "https://iswa.gsfc.nasa.gov/"
                },
                {
                    "flrID": "2026-06-15T08:00:00-FLR-002",
                    "instruments": [{"displayName": "GOES-16: EXIS 1.0-8.0"}],
                    "beginTime": "2026-06-15T07:50Z",
                    "peakTime": "2026-06-15T08:10Z",
                    "endTime": "2026-06-15T08:45Z",
                    "classType": "M5.4",
                    "sourceLocation": "S20W10",
                    "activeRegionNum": 13614,
                    "link": "https://iswa.gsfc.nasa.gov/"
                }
            ],
            "coronal_mass_ejections": [
                {
                    "cmeID": "2026-06-15T10:00:00-CME-001",
                    "startTime": "2026-06-15T10:00Z",
                    "note": "Halo CME associated with M5.4 flare. Earth-directed component possible.",
                    "instruments": [{"displayName": "SOHO: LASCO-C2"}, {"displayName": "SOHO: LASCO-C3"}]
                }
            ]
        }
        
    return weather_data

def get_apod():
    """
    Fetches the Astronomy Picture of the Day (APOD).
    (Module 7: AI Astronomer)
    """
    url = f"https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error fetching APOD data: {e}")
        return None

if __name__ == "__main__":
    print("Testing NASA API Ingestion...")
    neos = get_near_earth_objects(days_ahead=1)
    print(f"Found {len(neos)} Near Earth Objects.")
    if neos:
        print(f"Closest NEO: {neos[0]['name']} at {neos[0]['miss_distance_km']} km")
    
    space_weather = get_space_weather()
    print(f"Recent Solar Flares: {len(space_weather.get('solar_flares', []))}")
