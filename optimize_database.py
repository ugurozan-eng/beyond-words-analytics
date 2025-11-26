import asyncio
import sys
import os
from sqlalchemy import select, update

# Windows yol hatasını önlemek için
sys.path.append(os.getcwd())

from app.db.session import async_session_maker
from app.models import Listing
from app.services.ai_service import HybridSEOService
from app.services.mock_etsy import MockEtsyService

async def optimize_product():
    print("🚀 OTOMATİK OPTİMİZASYON BAŞLATILIYOR...\n")

    # 1. Önce Mock Servisten o ürünün ID'sini öğrenelim
    mock = MockEtsyService()
    mock_data = mock.get_mock_listing()
    target_id = mock_data["listing_id"]

    async with async_session_maker() as db:
        # 2. Veritabanından bu ürünü bulalım
        print(f"🔍 Veritabanında ürün aranıyor (ID: {target_id})...")
        result = await db.execute(select(Listing).where(Listing.etsy_listing_id == target_id))
        listing = result.scalars().first()

        if not listing:
            print("❌ HATA: Ürün veritabanında bulunamadı! Önce 'python test_db_save.py' çalıştırın.")
            return

        print(f"✅ Ürün Bulundu: {listing.title}")
        print(f"🖼️  Görsel: {listing.url}")
        print("-" * 40)

        # 3. Yapay Zekayı Çağır
        ai = HybridSEOService()
        
        print("🤖 1. Adım: Görsel analiz ediliyor...")
        # Listing tablosunda image_url yoksa mock veriden alalım (test için)
        # Normalde listing.image_url olur. Şimdilik mock veriyi kullanıyoruz.
        image_url = mock_data["images"][0] 
        
        visual_data = await ai.analyze_image(image_url)
        
        if not visual_data:
            print("❌ Görsel analiz edilemedi. İşlem iptal.")
            return

        print("🤖 2. Adım: Yeni SEO verileri yazılıyor...")
        seo_result = await ai.generate_seo_content(listing.title, visual_data)

        # 4. Veritabanını GÜNCELLE (En Kritik Yer)
        print("-" * 40)
        print(f"🔻 ESKİ BAŞLIK: {listing.title}")
        print(f"green🔺 YENİ BAŞLIK: {seo_result.get('title')}")
        print("-" * 40)

        # Yeni verileri kayda işle
        listing.title = seo_result.get('title', listing.title)
        listing.description = seo_result.get('description', listing.description)
        
        # Etiketler liste gelirse virgüle çevir
        tags = seo_result.get('tags')
        if isinstance(tags, list):
            listing.tags = ",".join(tags)
        else:
            listing.tags = str(tags)

        # Değişiklikleri kaydet
        await db.commit()
        print("💾 GÜNCELLEME VERİTABANINA KAYDEDİLDİ! ✅")
        print("Artık veritabanınızda optimize edilmiş veri var.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(optimize_product())