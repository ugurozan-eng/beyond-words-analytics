import requests
import json

api_key = "AIzaSyBnrS0t2jtZm9_Dooonyq2FU8qwydsw4X8"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
headers = {"Content-Type": "application/json"}
payload = {
    "contents": [{"parts": [{"text": "Hello"}]}]
}

try:
    print(f"Sending POST to Gemini API...")
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
