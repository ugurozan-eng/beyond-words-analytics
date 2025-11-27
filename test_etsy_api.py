import requests

endpoints = [
    "http://api.etsy.com/v0.1/public/guest/search_suggestions?q=minimalist",
    "https://openapi.etsy.com/v2/public/search/suggestions?q=minimalist",
    "https://www.etsy.com/api/v6/public/search/suggestions?q=minimalist"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Referer": "https://www.etsy.com/"
}

for url in endpoints:
    print(f"Testing: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.text[:200]}...")
        else:
            print("Failed.")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
