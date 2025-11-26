import asyncio
import sys
import os

# Windows yol hatasını önlemek için
sys.path.append(os.getcwd())

from app.services.ai_service import HybridSEOService
from app.services.mock_etsy import MockEtsyService

async def run_analysis():
    print("🚀 ANALİZ BAŞLIYOR...\n")

    # 1. Sahte Veriyi Al
    try:
        mock = MockEtsyService()
        product = mock.get_mock_listing()
        print(f"📦 Ürün: {product['title']}")
        print(f"🖼️  Görsel Linki Hazır")
        print("-" * 30)
    except Exception as e:
        print(f"Mock servisi hatası: {e}")
        return

    # 2. AI Servisini Başlat
    try:
        ai = HybridSEOService()

        # 3. Görsel Analizi Yap
        print("1. Aşama: Görsel GPT-4o'ya gönderiliyor...")
        visual_data = await ai.analyze_image(product['images'][0])
        
        if not visual_data:
            print("❌ Görsel analiz edilemedi. Anahtarları veya kredinizi kontrol edin.")
            return

        print("\n🎨 [GÖRSEL ANALİZ SONUCU]:")
        print(visual_data)

        # 4. SEO Metni Yazdır
        print("\n2. Aşama: Claude ile SEO Metni Yazılıyor...")
        seo_result = await ai.generate_seo_content(product['title'], visual_data)
        
        print("\n✨✨✨ [YENİ SEO ÖNERİSİ] ✨✨✨")
        print(f"📌 Başlık: {seo_result.get('title')}")
        print(f"📝 Açıklama: {seo_result.get('description')}")
        print(f"🏷️  Etiketler: {seo_result.get('tags')}")
        
    except Exception as e:
        print(f"\n❌ BEKLENMEYEN HATA: {e}")
        print("İpucu: .env dosyasındaki API anahtarlarının başında/sonunda boşluk kalmış olabilir mi?")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_analysis())