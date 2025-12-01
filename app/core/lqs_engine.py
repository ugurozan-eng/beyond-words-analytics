from typing import List, Dict, Any
from pydantic import BaseModel

class LQSInput(BaseModel):
    image_url: str
    title: str
    tags: List[str]
    visual_data: Dict[str, Any]
    image_count: int = 1
    has_video: bool = False
    category_id: str = "general"

def calculate_lqs_3_1(data: LQSInput) -> Dict[str, Any]:
    """
    Cyclear LQS v3.2 (Scientific Edition)
    Ref: Zakrewsky & Aryafar (Etsy Data Science) - Feature Vectors
    """
    score = 0.0
    feedback = []
    
    # --- MODULE 1: VISUAL IMPULSE (Max 35) ---
    visual_score = 0.0
    v_data = data.visual_data
    
    # 1. Tech Quality (0 or 5)
    tech_val = 5.0 if v_data.get("is_sharp", True) else 0.0
    visual_score += tech_val
    if tech_val < 5: feedback.append("Görsel netliği düşük.")

    # 2. Simplicity (Max 10) - [Paper: Simplicity leads to CTR]
    simp_score = float(v_data.get("simplicity_score", 0))
    if "simplicity_score" not in v_data: 
        simp_score = 10.0 if v_data.get("is_centered", False) else 5.0
    
    visual_score += simp_score
    if simp_score < 7: feedback.append("Kompozisyon karmaşık (Simplicity Principle).")

    # 3. Texture/Aesthetics (Max 10) - [Paper: Texture/Style]
    tex_score = float(v_data.get("texture_aesthetics", 0))
    if "texture_aesthetics" not in v_data:
        tex_score = 10.0 if v_data.get("high_contrast", False) else 4.0
        
    visual_score += tex_score
    if tex_score < 7: feedback.append("Doku ve estetik zayıf.")

    # 4. Lifestyle (Max 10)
    life_score = 10.0 if v_data.get("has_lifestyle", False) else 0.0
    visual_score += life_score
    if life_score < 5: feedback.append("Lifestyle görsel eksik.")
    
    visual_score = min(visual_score, 35.0)

    # --- MODULE 2: SEO FOUNDATION (Max 35) ---
    seo_score = 0.0
    core_object = str(v_data.get("core_object", "")).lower()
    title_lower = data.title.lower()
    
    # Pareto Title
    pareto = 15.0
    if core_object and core_object not in title_lower[:40]: pareto -= 8
    if len(data.title) < 80: pareto -= 4
    if data.title.isupper(): pareto -= 3
    seo_score += max(0, pareto)
    
    # Tag Health
    tag_s = 0.0
    tag_s += min(2.0, (len(data.tags)/13)*2) # Density
    
    # Semantic Relevance
    match_c = sum(1 for t in data.tags if core_object in t.lower())
    if len(data.tags) > 0 and (match_c/len(data.tags)) > 0.4: tag_s += 6
    elif len(data.tags) > 0 and (match_c/len(data.tags)) >= 0.1: tag_s += 3
    
    # Long Tail
    long_t = sum(1 for t in data.tags if " " in t.strip())
    if long_t >= 7: tag_s += 7
    elif long_t >= 4: tag_s += 3.5
    
    seo_score += tag_s
    
    # Asset Richness
    if data.image_count >= 5: seo_score += 4
    elif data.image_count >= 2: seo_score += 2
    if data.has_video: seo_score += 1

    # --- MODULE 3: ZEITGEIST (Max 30) ---
    z_score = 0.0
    # Simulating Market Data
    z_score += (visual_score / 35.0) * 15.0 # Best Seller Similarity
    velocity = 8.0 # Stable
    z_score += velocity
    z_score += 5.0 # In-Season
    
    # Trendsetter Protocol
    is_trendsetter = False
    if velocity < 6 and visual_score > 30:
        z_score = 25.0
        is_trendsetter = True
        feedback.append("TRENDSETTER: Trend düşük ama Görsel mükemmel.")

    total = min(100.0, visual_score + seo_score + z_score)
    
    return {
        "total_score": round(total, 1),
        "breakdown": {
            "visual_impulse_score": round(visual_score, 1),
            "seo_foundation_score": round(seo_score, 1),
            "zeitgeist_score": round(z_score, 1),
            "visual_details": {"simplicity": simp_score, "texture": tex_score}
        },
        "is_trendsetter": is_trendsetter,
        "feedback": feedback
    }