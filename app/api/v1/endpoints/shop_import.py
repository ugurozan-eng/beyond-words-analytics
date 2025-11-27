from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class ShopImportRequest(BaseModel):
    url: str

class MockProduct(BaseModel):
    listing_id: int
    title: str
    price: float
    currency: str
    image_url: str
    tags: List[str]
    views: int
    favorites: int

class ShopImportResponse(BaseModel):
    status: str
    shop_name: str
    products: List[MockProduct]

@router.post("/fetch-shop", response_model=ShopImportResponse)
async def fetch_shop(request: ShopImportRequest):
    # Basic validation
    if "etsy.com" not in request.url:
        raise HTTPException(status_code=400, detail="Invalid Etsy URL")

    # Extract shop name (mock extraction)
    try:
        # Simple logic: take the part after /shop/ or the last part of the path
        if "/shop/" in request.url:
            shop_name = request.url.split("/shop/")[1].split("?")[0].split("/")[0]
        else:
            shop_name = "DetectedShop"
    except:
        shop_name = "UnknownShop"

    # Generate Mock Data
    mock_products = []
    for i in range(5):
        mock_products.append(MockProduct(
            listing_id=random.randint(100000, 999999),
            title=f"Sample Product {i+1} from {shop_name}",
            price=round(random.uniform(10.0, 100.0), 2),
            currency="USD",
            image_url="https://placehold.co/600x400",
            tags=[f"tag{k}" for k in range(random.randint(3, 8))],
            views=random.randint(50, 500),
            favorites=random.randint(5, 50)
        ))

    return ShopImportResponse(
        status="success",
        shop_name=shop_name,
        products=mock_products
    )
