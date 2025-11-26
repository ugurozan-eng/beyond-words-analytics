from typing import List, Dict, Any
import random
from datetime import datetime

# --- INPUT / OUTPUT MODELLERİ ---
class LQSInput:
    def __init__(self, 
                 image_url: str, 
                 title: str, 
                 tags: List[str], 
                 # Gemini'den gelen nesnel veriler
                 visual_data: Dict[str, Any], 
                 # Kullanıcıdan veya Mock'tan gelen veriler
                 image_count: int = 5, 
                 has_video: bool = False):
        self.image_url = image_url
        self.title = title
        self.tags = [t.lower() for t in tags]
        self.visual_data = visual_data
        self.image_count = image_count
        self.has_video = has_video

def calculate_lqs_3_1(data: LQSInput) -> Dict[str, Any]:
    """
    LQS 3.1 Algoritması: Visual, SEO ve Zeitgeist modüllerini hesaplar.
    Toplam 100 Puan üzerinden değerlendirir.
    """
    
    # --- 1. MODÜL: VISUAL IMPULSE (Max 35 Puan) ---
    # Gemini'den gelen ham verileri puana çeviriyoruz.
    v_data = data.visual_data
    
    # Puanlama
    score_tech = 5 if v_data.get("is_sharp", False) else 0
    score_focus = 10 if v_data.get("is_centered", False) else 0
    score_contrast = 10 if v_data.get("high_contrast", False) else 0
    score_mockup = 10 if v_data.get("has_lifestyle", False) else 0
    
    visual_score = score_tech + score_focus + score_contrast + score_mockup
    
    # Kritik verileri al
    core_object = v_data.get("core_object", "product").lower()
    visual_style = v_data.get("visual_style", "modern").lower()

    # --- 2. MODÜL: SEO FOUNDATION (Max 35 Puan) ---
    
    # A. Pareto Title (Max 15)
    title_lower = data.title.lower()
    score_pareto = 15
    
    # Kural 1: Core object ilk 40 karakterde mi?
    if core_object not in title_lower[:45]: # Biraz esneme payı
        score_pareto -= 8
        
    # Kural 2: Uzunluk < 80 mi?
    if len(data.title) < 80:
        score_pareto -= 4
        
    # Kural 3: Spam kontrolü (All caps veya tekrar)
    is_all_caps = data.title.isupper()
    words = title_lower.split()
    has_spam = any(words.count(w) > 3 for w in words)
    
    if is_all_caps or has_spam:
        score_pareto -= 3
    
    if score_pareto < 0: score_pareto = 0

    # B. Tag Health (Max 15)
    # Doluluk (2 Puan)
    tag_count = len(data.tags)
    score_tag_fill = min((tag_count / 13) * 2, 2)
    
    # Anlamsal Alaka (6 Puan)
    core_words = set(core_object.split())
    # Etiketlerin içindeki tüm kelimeleri birleştir
    all_tag_text = " ".join(data.tags)
    match_count = sum(1 for word in core_words if word in all_tag_text)
    match_ratio = match_count / len(core_words) if core_words else 0
    
    score_tag_rel = 0
    if match_ratio > 0.4: score_tag_rel = 6
    elif match_ratio > 0.1: score_tag_rel = 3
    
    # Long Tail Gücü (7 Puan)
    long_tail_count = sum(1 for t in data.tags if " " in t.strip())
    score_tag_long = 0
    if long_tail_count >= 7: score_tag_long = 7
    elif long_tail_count >= 4: score_tag_long = 3.5
    
    seo_score = score_pareto + score_tag_fill + score_tag_rel + score_tag_long
    
    # C. Asset Richness (Max 5)
    score_asset = 0
    if data.image_count >= 5: score_asset += 4
    elif data.image_count >= 2: score_asset += 2
    
    if data.has_video: score_asset += 1
    
    # SEO Toplam (Max 35'e sabitleme, Asset ile taşabilir)
    final_seo_score = min(seo_score + score_asset, 35)

    # --- 3. MODÜL: ZEITGEIST (Max 30 Puan) ---
    # Simülasyon: Ürün isminden bir 'seed' oluşturup rastgele ama sabit değerler üretelim
    random.seed(data.title) 
    
    # A. Best Seller Similarity (Max 15)
    # Mock Data: 5 ile 15 arasında bir değer
    score_bestseller = random.uniform(5, 15)
    
    # B. Market Velocity (Max 10)
    velocity_types = [10, 8, 5] # Rising, Stable, Falling
    score_velocity = random.choice(velocity_types)
    
    # C. Seasonal Relevance (Max 5)
    current_month = datetime.now().month
    # Mock seasonality check: Rastgele In-Season veya Off-Season
    score_seasonal = random.choice([5, 2])
    
    zeitgeist_score = score_bestseller + score_velocity + score_seasonal
    
    # --- TRENDSETTER PROTOCOL (Edge Case) ---
    # Eğer Trend skoru düşük ama Görsel Skor mükemmelse, trendi düşürme, artır.
    if zeitgeist_score < 15 and visual_score > 30:
        zeitgeist_score = 25 # Trendsetter bonusu
        # print("🌟 TRENDSETTER PROTOCOL ACTIVATED")

    # --- TOPLAM SKOR ---
    total_score = visual_score + final_seo_score + zeitgeist_score
    
    return {
        "total_score": round(total_score, 1),
        "breakdown": {
            "visual_impulse_score": round(visual_score, 1),
            "seo_foundation_score": round(final_seo_score, 1),
            "zeitgeist_score": round(zeitgeist_score, 1)
        },
        "details": {
            "core_object": core_object,
            "visual_style": visual_style,
            "pareto_check": score_pareto,
            "tag_health": score_tag_rel + score_tag_long,
            "is_trendsetter": (zeitgeist_score == 25)
        }
    }