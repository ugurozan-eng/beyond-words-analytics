from fastapi import APIRouter
from app.api.v1.endpoints import listings, analyze, shop_import, keywords, tag_spy, generate

api_router = APIRouter()

# Mevcut rotalar
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(analyze.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(shop_import.router, prefix="/import", tags=["import"])
api_router.include_router(keywords.router, prefix="/keywords", tags=["keywords"])
api_router.include_router(tag_spy.router, prefix="/spy", tags=["spy"])

# EKSİK OLAN VE ŞİMDİ EKLENEN ROTA:
api_router.include_router(generate.router, prefix="/generate", tags=["generate"])