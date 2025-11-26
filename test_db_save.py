import asyncio
import sys
import os

# Windows yol hatasını önlemek için bu ayar şart
sys.path.append(os.getcwd())

from app.db.session import async_session_maker
from app.models import Shop, Listing, User
from app.services.mock_etsy import MockEtsyService
from sqlalchemy import select
from datetime import datetime

async def test_save_mock_data():
    print("🛠️ Simülasyon Başlatılıyor...")
    
    try:
        mock_service = MockEtsyService()
        data = mock_service.get_mock_listing()
    except Exception as e:
        print(f"HATA: Mock servisi başlatılamadı. Detay: {e}")
        return

    async with async_session_maker() as db:
        # 1. Kullanıcı Kontrolü
        result = await db.execute(select(User).where(User.email == "test@demo.com"))
        user = result.scalars().first()
        
        if not user:
            print("👤 Test Kullanıcısı Oluşturuluyor...")
            user = User(email="test@demo.com", hashed_password="fake_hash")
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        # 2. Dükkan Kontrolü
        result = await db.execute(select(Shop).where(Shop.etsy_shop_id == "MOCK_SHOP_1"))
        shop = result.scalars().first()
        
        if not shop:
            print("🏪 Test Dükkanı Oluşturuluyor...")
            shop = Shop(
                user_id=user.id,
                etsy_shop_id="MOCK_SHOP_1",
                shop_name="Demo Vintage Store",
                access_token="fake_token",
                refresh_token="fake_refresh",
                token_expires_at=datetime.utcnow()
            )
            db.add(shop)
            await db.commit()
            await db.refresh(shop)

        # 3. Ürünü Kaydet
        result_listing = await db.execute(select(Listing).where(Listing.etsy_listing_id == data["listing_id"]))
        existing_listing = result_listing.scalars().first()

        if existing_listing:
            print("ℹ️ Bu ürün zaten veritabanında var, tekrar eklenmedi.")
        else:
            print(f"📦 Ürün Kaydediliyor: {data['title'][:30]}...")
            listing = Listing(
                shop_id=shop.id,
                etsy_listing_id=data["listing_id"],
                title=data["title"],
                description=data["description"],
                state=data["state"],
                url=data["url"],
                price_amount=data["price"]["amount"],
                price_divisor=data["price"]["divisor"],
                tags=",".join(data["tags"]),
                materials=",".join(data["materials"]),
                creation_timestamp=123456,
                last_modified_timestamp=123456
            )
            
            db.add(listing)
            await db.commit()
            print("✅ BAŞARILI! Sahte veri veritabanına işlendi.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_save_mock_data())