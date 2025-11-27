import requests
import json

url = "http://127.0.0.1:8000/api/v1/analysis/"
payload = {
    "id": "42acf1ea-e895-4d42-a2e0-bee0595e003d",
    "image_url": "https://i.etsystatic.com/62350073/r/il/f06db3/7352964132/il_794xN.7352964132_2ydx.jpg",
    "product_title": "Test Product",
    "force_refresh": False
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
