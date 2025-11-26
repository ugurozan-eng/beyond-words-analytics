import math
from typing import Dict, Any, List

class PricingEngine:
    def __init__(self, 
                 lqs_score: float, 
                 competitor_price: float = 0.0, 
                 category_min: float = 5.0, 
                 category_max: float = 100.0,
                 seasonality_data: List[int] = None):
        """
        Neuro-Pricing Motoru
        
        Args:
            lqs_score (float): 0-100 arası Listing Quality Score.
            competitor_price (float): Varsa rakip fiyatı, yoksa 0.
            category_min (float): Kategorinin taban fiyatı (Güvenlik sibobu).
            category_max (float): Kategorinin tavan fiyatı.
            seasonality_data (List[int]): 12 aylık talep puanları (0-100).
        """
        self.lqs_score = lqs_score
        self.competitor_price = competitor_price
        self.cat_min = category_min
        self.cat_max = category_max
        self.seasonality = seasonality_data if seasonality_data else []

    def calculate_prices(self) -> Dict[str, Any]:
        # 1. Taban Fiyat (Base Price) - LQS'e göre konumlanma
        # Görsel kalite arttıkça fiyat üstel olarak artar (Logaritmik değil).
        # Formül: Min + (LQS/100)^2 * (Max - Min)
        quality_ratio = (self.lqs_score / 100.0) ** 2
        perceived_value = self.cat_min + quality_ratio * (self.cat_max - self.cat_min)
        
        # 2. Rakip Çapası (Competitor Anchor)
        # Eğer rakip varsa ve bizim görselimiz iyiyse (LQS > 70), rakibin %10 üstüne çık.
        # Görselimiz kötüyse, rekabet için rakibin %10 altına in.
        strategic_price = perceived_value
        strategy_note = "Görsel kalite bazlı değerleme"
        
        if self.competitor_price > 0:
            if self.lqs_score >= 75:
                # Premium Strateji
                comp_target = self.competitor_price * 1.15
                strategic_price = (perceived_value * 0.6) + (comp_target * 0.4)
                strategy_note = "Premium: Rakibinden daha kaliteli görünüyor (+%15)"
            else:
                # Penetrasyon Stratejisi
                comp_target = self.competitor_price * 0.90
                strategic_price = (perceived_value * 0.4) + (comp_target * 0.6)
                strategy_note = "Rekabetçi: Pazara giriş için rakip altı (-%10)"

        # 3. Mevsimsellik Çarpanı (Seasonality Multiplier)
        # Önümüzdeki 3 ayın ortalaması, yıllık ortalamadan %20 yüksekse fiyatı artır.
        season_multiplier = 1.0
        if self.seasonality:
            # Basit simülasyon: Listenin sonundan başa dönerek 3 aylık döngüye bakılabilir
            # Şimdilik ortalamaya göre basit bir mantık kuralım
            avg_demand = sum(self.seasonality) / len(self.seasonality)
            # Varsayım: Şu anki ay ilk eleman. Gelecek 3 aya bak.
            next_3_months = self.seasonality[:3] 
            next_3_avg = sum(next_3_months) / len(next_3_months) if next_3_months else 0
            
            if next_3_avg > avg_demand * 1.2:
                season_multiplier = 1.10 # Yüksek sezon zammı
                strategy_note += " + Yüksek Sezon"
            elif next_3_avg < avg_demand * 0.8:
                season_multiplier = 0.95 # Ölü sezon indirimi
        
        raw_final_price = strategic_price * season_multiplier

        # 4. Neuro-Psychological Adjustment (Charm Pricing)
        # 14.20 -> 13.95 (Algısal Ucuzluk)
        # 55.60 -> 59.00 (Lüks Algısı) veya 54.95
        
        optimal_price = self._apply_charm_pricing(raw_final_price)
        
        # Aralık Belirleme
        min_price = max(optimal_price * 0.85, self.cat_min)
        max_price = optimal_price * 1.25

        return {
            "min": round(min_price, 2),
            "optimal": round(optimal_price, 2),
            "max": round(max_price, 2),
            "reason": strategy_note
        }

    def _apply_charm_pricing(self, price: float) -> float:
        """Fiyatı .95, .99 veya tam sayıya yuvarlar."""
        if price < 10:
            # Küçük ürünlerde .95 veya .99
            # Örn: 5.30 -> 4.99 veya 5.95
            decimal = price - int(price)
            if decimal < 0.5: return int(price) - 0.05 # 5.30 -> 4.95
            else: return int(price) + 0.95 # 5.60 -> 5.95
            
        elif price < 50:
            # Orta segmentte .95
            return int(price) + 0.95
            
        else:
            # Lüks ürünlerde tam sayı veya .00
            # 142.50 -> 145.00
            return round(price)