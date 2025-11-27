import requests
import json

url = "http://localhost:8000/api/v1/listings/"

try:
    print(f"GET {url}...")
    response = requests.get(url, timeout=10)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Count: {len(data)}")
        if len(data) > 0:
            print(f"First Item: {data[0]['title']}")
    else:
        print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
