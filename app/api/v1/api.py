# app/api/v1/api.py
from fastapi import APIRouter

# Endpoint dosyalarınızı buradan içe aktarın (import edin)
from app.api.v1.endpoints import listings
from app.api.v1.endpoints import analyze  
from app.api.v1.endpoints import settings

api_router = APIRouter()

# Endpoint'leri API router'a dahil et
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])