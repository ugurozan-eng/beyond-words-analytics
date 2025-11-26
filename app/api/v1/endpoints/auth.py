from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth_service import EtsyAuthService
from app.db.session import get_db

router = APIRouter()
auth_service = EtsyAuthService()

@router.get("/login")
async def login():
    """
    1. Adım: Kullanıcıyı Etsy onay ekranına yönlendirir.
    """
    # PKCE güvenliği için şifreli anahtarlar oluştur
    verifier, challenge = auth_service.generate_pkce_pair()
    
    # İleride kullanmak üzere verifier'ı şimdilik ekrana yazalım (Geliştirme aşaması)
    print(f"🔑 GÜVENLİK ANAHTARI (Verifier): {verifier}")
    
    # Etsy'nin onay sayfasına git
    auth_url = auth_service.get_authorization_url(challenge, state="random_state_string")
    return RedirectResponse(url=auth_url)

@router.get("/callback")
async def callback(code: str, state: str, db: AsyncSession = Depends(get_db)):
    """
    2. Adım: Etsy'den dönen onayı karşılar.
    """
    return {
        "message": "Etsy'den Başarıyla Döndük!",
        "auth_code": code,
        "note": "Bu kodu kullanarak birazdan token alacağız."
    }