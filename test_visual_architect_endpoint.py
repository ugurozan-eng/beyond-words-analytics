import requests
import json

# URL = "http://localhost:8000/api/v1/visual-architect/generate"
URL = "https://cyclear-backend.onrender.com/api/v1/visual-architect/generate"

payload = {
    "product_title": "Test Product",
    "visual_concept": "Test Concept",
    "included_objects": "Test Objects",
    "style": "minimalist",
    "lighting": "studio"
}

try:
    print(f"Testing URL: {URL}")
    response = requests.post(URL, json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Success!")
    else:
        print("❌ Failed!")

except Exception as e:
    print(f"Error: {e}")
