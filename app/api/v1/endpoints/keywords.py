from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
import requests
import random

router = APIRouter()

class KeywordResult(BaseModel):
    term: str
    volume: int
    competition: str
    ctr: float
    trend: str

class KeywordExploreResponse(BaseModel):
    keyword: str
    results: List[KeywordResult]

@router.get("/explore", response_model=KeywordExploreResponse)
def explore_keywords(query: str = Query(..., min_length=1)):
    """
    Fetch search suggestions from Etsy and enrich with mock metrics including Trend.
    Falls back to smart mock generation if API fails.
    """
    # Try Etsy API first (currently unstable/deprecated)
    url = f"https://api.etsy.com/v0.1/public/guest/search_suggestions?q={query}"
    etsy_results = []
    
    try:
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            data = response.json()
            etsy_results = data.get("results", [])
    except Exception:
        pass # Fallback to mock

    # If API returned nothing, generate smart mocks
    if not etsy_results:
        suffixes = ["ideas", "gift", "art", "decor", "print", "svg", "pattern", "handmade", "vintage", "jewelry", "design", "template"]
        prefixes = ["custom", "personalized", "unique", "minimalist", "boho", "rustic", "modern", "cute"]
        
        # Generate variations
        etsy_results = [
            f"{query}",
            f"{query} for sale",
            f"{query} ideas"
        ]
        
        for s in suffixes:
            etsy_results.append(f"{query} {s}")
        
        for p in prefixes:
            etsy_results.append(f"{p} {query}")
            
        # Shuffle and limit
        random.shuffle(etsy_results)
        etsy_results = etsy_results[:12]

    enriched_results = []
    for item in etsy_results:
        term = item.get("term") if isinstance(item, dict) else str(item)
        
        # Mock Metrics
        volume = random.randint(500, 50000)
        competition = random.choice(["High", "Medium", "Low"])
        ctr = round(random.uniform(0.01, 0.05), 3) # 1% to 5%
        
        # Mock Trend
        trend_val = random.randint(-10, 35)
        trend_sign = "+" if trend_val > 0 else ""
        trend = f"{trend_sign}{trend_val}%"
        
        enriched_results.append(KeywordResult(
            term=term,
            volume=volume,
            competition=competition,
            ctr=ctr,
            trend=trend
        ))
        
    return KeywordExploreResponse(keyword=query, results=enriched_results)
