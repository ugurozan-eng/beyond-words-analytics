from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import random
import re

router = APIRouter()

class TagSpyRequest(BaseModel):
    url: str

class TagStat(BaseModel):
    tag: str
    frequency: int
    volume: int
    competition: str

class TagSpyResponse(BaseModel):
    shop_name: str
    analyzed_product_count: int
    top_tags: List[TagStat]

@router.post("/analyze", response_model=TagSpyResponse)
def analyze_shop_tags(request: TagSpyRequest):
    """
    Analyze competitor shop tags.
    Extracts shop name from URL and generates mock tag frequency data.
    """
    # Extract shop name (Mock logic)
    # Expected format: https://www.etsy.com/shop/ShopName or similar
    match = re.search(r"shop/([^/?]+)", request.url)
    shop_name = match.group(1) if match else "CompetitorShop"
    
    # Mock Data Generation
    # We want to simulate 20 products and aggregate tags
    
    common_tags = [
        "digital planner", "goodnotes", "ipad planner", "printable", 
        "minimalist", "boho", "wall art", "svg", "sticker", "template"
    ]
    
    niche_tags = [
        "wedding invitation", "baby shower", "custom portrait", "logo design",
        "resume template", "budget planner", "fitness tracker", "meal planner"
    ]
    
    # Generate a pool of tags from 20 products
    all_tags = []
    
    # Product 1-10: Heavily focused on "digital planner" niche
    for _ in range(10):
        all_tags.extend(["digital planner", "goodnotes", "ipad planner", "productivity"])
        all_tags.extend(random.sample(common_tags, 2))
        
    # Product 11-15: Mixed with "printable"
    for _ in range(5):
        all_tags.extend(["printable", "wall art", "decor"])
        all_tags.extend(random.sample(common_tags, 2))
        
    # Product 16-20: Random niche
    for _ in range(5):
        all_tags.extend(random.sample(niche_tags, 3))
        all_tags.extend(random.sample(common_tags, 1))

    # Aggregate counts
    tag_counts = {}
    for tag in all_tags:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
    # Create response objects
    top_tags = []
    for tag, count in tag_counts.items():
        # Mock metrics for volume/competition
        volume = random.randint(1000, 50000)
        competition = "High" if volume > 20000 else "Medium" if volume > 5000 else "Low"
        
        # Adjust competition based on frequency for realism (high freq usually means high comp)
        if count > 10:
            competition = "High"
            volume = random.randint(20000, 100000)

        top_tags.append(TagStat(
            tag=tag,
            frequency=count,
            volume=volume,
            competition=competition
        ))
        
    # Sort by frequency desc
    top_tags.sort(key=lambda x: x.frequency, reverse=True)
    
    return TagSpyResponse(
        shop_name=shop_name,
        analyzed_product_count=20,
        top_tags=top_tags
    )
