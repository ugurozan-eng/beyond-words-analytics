import asyncio
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import json
import base64
import re
import traceback

from app.api.deps import get_db
from app.models import Listing, ListingSnapshot
from app.core.lqs_engine import LQSInput, calculate_lqs_3_1
from app.core.lqs_engine import LQSInput, calculate_lqs_3_1
from app.core.pricing import PricingEngine
from app.core.traffic_engine import TrafficIntelligence
from app.models.settings import Settings

class AnalysisRequest(BaseModel):
    id: str
    image_url: str
    product_title: str = "New Product"
    force_refresh: bool = False

class AnalysisResult(BaseModel):
    suggested_title: str
    suggested_description: str
    suggested_tags: List[str]
    lqs_score: float
    lqs_visual_score: float
    lqs_seo_score: float
    lqs_zeitgeist_score: float
    lqs_reason: str
    suggested_materials: str
    suggested_styles: str
    suggested_colors: str
    suggested_occasions: str
    suggested_recipients: str
    suggested_faqs: str
    predicted_price_min: float
    predicted_price_max: float
    predicted_price_optimal: float 
    price_reason: str
    trend_score: float
    trend_reason: str
    best_selling_months: str
    monthly_popularity: str 
    tags_focus: str
    tags_long_tail: str
    tags_aesthetic: str
    tags_creative: str
    competitor_analysis: str
    traffic_data: Optional[Dict[str, Any]] = None
    last_analyzed_at: Optional[datetime] = None

router = APIRouter()

# --- GÜVENLİ ETİKET DOĞRULAMA MOTORU ---
def validate_and_fix_tags(raw_tags: List[str], title: str) -> List[str]:
    """
    Etsy kurallarına (max 20 karakter) uygun hale getirir.
    Tek kelimelik etiketleri başlık kullanarak 'Long Tail' yapmaya çalışır.
    """
    valid_tags = []
    seen_tags = set()
    
    # Başlıktan kelime havuzu oluştur (güvenli ekleme yapmak için)
    title_words = re.findall(r'\w+', title.lower())
    
    for tag in raw_tags:
        clean_tag = tag.strip()
        clean_tag = re.sub(r'[^\w\s]', '', clean_tag)
        
        if not clean_tag: continue
        
        # 1. KURAL: UZUNLUK KONTROLÜ (Max 20)
        if len(clean_tag) > 20:
            words = clean_tag.split()
            while len(" ".join(words)) > 20 and len(words) > 1:
                words.pop() 
            
            new_tag = " ".join(words)
            if len(new_tag) > 20 or len(new_tag) < 3:
                continue
            clean_tag = new_tag

        # 2. KURAL: TEK KELİME KONTROLÜ (Single Word)
        if " " not in clean_tag:
            if clean_tag.lower() in title_words:
                try:
                    idx = title_words.index(clean_tag.lower())
                    if idx > 0:
                        clean_tag = f"{title_words[idx-1]} {clean_tag}"
                    elif idx < len(title_words) - 1:
                        clean_tag = f"{clean_tag} {title_words[idx+1]}"
                except:
                    pass
        
        # 3. KURAL: TEKRAR VE FİNAL KONTROL
        final_tag = clean_tag.title()
        if len(final_tag) <= 20 and final_tag.lower() not in seen_tags:
            valid_tags.append(final_tag)
            seen_tags.add(final_tag.lower())
    
    if len(valid_tags) < 13:
        for i in range(len(title_words) - 1):
            phrase = f"{title_words[i]} {title_words[i+1]}".title()
            if len(phrase) <= 20 and phrase.lower() not in seen_tags:
                valid_tags.append(phrase)
                seen_tags.add(phrase.lower())
                if len(valid_tags) >= 13: break

    return valid_tags[:13]

@router.post("/", response_model=AnalysisResult)
async def analyze_listing(request: AnalysisRequest, db: Session = Depends(get_db)):
    
    db_listing = db.query(Listing).filter(Listing.id == request.id).first()
    
    # --- CACHE MANTIĞI ---
    should_analyze = True
    if db_listing and db_listing.is_analyzed and db_listing.last_analyzed_at:
        if request.force_refresh:
            should_analyze = True
        elif db_listing.image_url != request.image_url:
            should_analyze = True
        else:
            now = datetime.now(timezone.utc) if db_listing.last_analyzed_at.tzinfo else datetime.now()
            time_diff = now - db_listing.last_analyzed_at
            minutes_passed = time_diff.total_seconds() / 60
            hours_passed = minutes_passed / 60
            
            if hours_passed < 48: return get_cached_result(db_listing)

    if not should_analyze:
        return get_cached_result(db_listing)

    my_api_key = "AIzaSyBpRW4NwWrtj09rFTIfyMlGVJVyrvIwPQY" 
    target_model = "gemini-2.5-flash"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={my_api_key}"
    headers = {"Content-Type": "application/json"} 

    # --- JSON YAPISI ---
    common_structure = """
    {
        "suggested_title": "SEO Optimized Title...", 
        "suggested_description": "Sales oriented description...",
        "tags_pool_20": ["tag1", "tag2", "tag3", ...], 
        "tags_focus": ["core1", "core2"], 
        "tags_long_tail": ["phrase 1", "phrase 2"], 
        "tags_aesthetic": ["style1", "vibe1"], 
        "tags_creative": ["unique idea 1"],
        "competitor_analysis": "...", 
        "monthly_popularity": [80, 90, 80, 70, 60, 50, 60, 70, 80, 90, 95, 90],
        "materials": "...", "styles": "...", "colors": "...", "occasions": "...", "recipients": "...",
        "faqs": [{"q": "...", "a": "..."}],
        "price_min": 10.0, "price_max": 50.0, 
        "price_reason": "...",
        "trend_score": 8.5, 
        "trend_reason": "...",
        "best_months": ["Nov", "Dec"],
        "visual_data": { 
            "is_sharp": true, 
            "is_centered": true, 
            "high_contrast": true, 
            "has_lifestyle": false,
            "core_object": "product",
            "visual_style": "style"
        },
        "price_max_valuation": 50.0,
        "traffic_data": {
            "total_visits": 1000,
            "insight": "Google traffic is rising...",
            "sources": [
                {"name": "Etsy Search", "value": 500, "color": "#F97316"},
                {"name": "Google Organic", "value": 300, "color": "#4285F4"},
                {"name": "Pinterest", "value": 150, "color": "#E60023"},
                {"name": "Direct", "value": 50, "color": "#10B981"}
            ]
        }
    }
    """

    # --- PROMPT GÜNCELLEMESİ ---
    base_instructions = """
    You are an expert Etsy SEO Engineer. 
    CRITICAL RULE: Etsy tags must be UNDER 20 CHARACTERS. 
    Do NOT generate single words like "Art" or "Gift". Always use Long Tail phrases like "Wall Art" or "Wedding Gift".
    Generate 20 high-quality tags in 'tags_pool_20' so we can filter the best ones.
    Also estimate 'traffic_data' sources based on the product type (e.g. visually appealing items get more Pinterest traffic).
    """

    if db_listing.listing_type == "competitor":
        print("🕵️‍♂️ AJAN MODU...")
        prompt_text = f"""
        {base_instructions}
        Act as a 'Competitor Spy'. Target: "{request.product_title}"
        
        TASKS:
        1. **VISUAL AUDIT (LQS 3.1):** Check sharpness, centering, contrast, lifestyle.
        2. **STRATEGY THEFT:** Extract their best keywords.
        3. **MARKET INTEL:** Estimate seasonality & trend.
        
        Return ONLY raw JSON:
        {common_structure}
        """
    else:
        print("🚀 UZMAN MODU...")
        prompt_text = f"""
        {base_instructions}
        Act as a 'Sales Engineer'. Product: "{request.product_title}"

        TASKS:
        1. **VISUAL DATA:** Extract boolean visual data.
        2. **NEURO-PRICING:** Estimate 'price_max_valuation' (Perceived Value).
        3. **KEYWORD STORM:** Generate 20 mixed tags (Focus, Long-Tail, Aesthetic).

        Return ONLY raw JSON:
        {common_structure}
        """

    mime_type = "image/jpeg"
    image_data = ""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(request.image_url, timeout=10.0)
            if resp.status_code != 200: raise HTTPException(status_code=400, detail="Resim indirilemedi.")
            image_data = base64.b64encode(resp.content).decode("utf-8")
            mime_type = resp.headers.get("content-type", "image/jpeg")
    except Exception as e:
        return empty_error_result(str(e))

    payload = {
        "contents": [{"parts": [{"text": prompt_text}, {"inline_data": {"mime_type": mime_type, "data": image_data}}]}],
        "generationConfig": {"temperature": 0.2, "topP": 0.8, "topK": 40}
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=50.0)
            result_json = response.json()
            try:
                candidate = result_json["candidates"][0]["content"]["parts"][0]["text"]
                cleaned_text = candidate.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned_text)
            except:
                data = {}

            # --- ETİKET DOĞRULAMA VE İYİLEŞTİRME ---
            raw_pool = data.get("tags_pool_20", [])
            if not raw_pool:
                raw_pool = (data.get("tags_focus", []) + data.get("tags_long_tail", []) + data.get("tags_aesthetic", []))
            
            final_tags = validate_and_fix_tags(raw_pool, request.product_title)
            
            # --- LQS MOTORU ---
            raw_visual = data.get("visual_data", {})
            if not isinstance(raw_visual, dict): raw_visual = {}
            
            lqs_input = LQSInput(
                image_url=request.image_url,
                title=data.get("suggested_title", request.product_title),
                tags=final_tags,
                visual_data=raw_visual,
                image_count=1,
                has_video=False
            )
            
            lqs_result = calculate_lqs_3_1(lqs_input)
            final_lqs = lqs_result["total_score"]
            lqs_breakdown = lqs_result["breakdown"]
            lqs_reason_text = f"Visual: {lqs_breakdown['visual_impulse_score']}/35, SEO: {lqs_breakdown['seo_foundation_score']}/35, Zeitgeist: {lqs_breakdown['zeitgeist_score']}/30"

            # --- PRICING ENGINE ---
            comp_price = 0.0
            if db_listing.listing_type == "competitor":
                comp_price = float(data.get("price_min", 0))

            gemini_max_valuation = float(data.get("price_max_valuation", 100.0))
            if gemini_max_valuation == 0: gemini_max_valuation = 100.0
            
            pricing_engine = PricingEngine(
                lqs_score=final_lqs,
                competitor_price=comp_price,
                category_min=5.0, 
                category_max=gemini_max_valuation, 
                seasonality_data=data.get("monthly_popularity", [])
            )
            
            pricing_result = pricing_engine.calculate_prices()

            # Veri Hazırlığı
            t_focus = data.get("tags_focus", []) if isinstance(data.get("tags_focus"), list) else []
            t_long = data.get("tags_long_tail", []) if isinstance(data.get("tags_long_tail"), list) else []
            t_aes = data.get("tags_aesthetic", []) if isinstance(data.get("tags_aesthetic"), list) else []
            t_creative = data.get("tags_creative", []) if isinstance(data.get("tags_creative"), list) else []
            
            str_focus = ",".join(t_focus)
            str_long = ",".join(t_long)
            str_aes = ",".join(t_aes)
            str_creative = ",".join(t_creative)
            monthly_str = json.dumps(data.get("monthly_popularity", []))
            comp_analysis = data.get("competitor_analysis", "")
            # --- TRAFFIC INTELLIGENCE ---
            settings = db.query(Settings).first()
            traffic_engine = TrafficIntelligence(lqs_score=final_lqs, settings=settings)
            traffic_data_result = traffic_engine.generate_data()
            traffic_json = json.dumps(traffic_data_result)

            if db_listing:
                current_time = datetime.now()
                snapshot = ListingSnapshot(
                    listing_id=db_listing.id,
                    created_at=current_time,
                    lqs_score=final_lqs,
                    lqs_visual_score=lqs_breakdown['visual_impulse_score'],
                    lqs_seo_score=lqs_breakdown['seo_foundation_score'],
                    lqs_zeitgeist_score=lqs_breakdown['zeitgeist_score'],
                    lqs_reason=lqs_reason_text,
                    suggested_title=data.get("suggested_title", ""),
                    suggested_description=data.get("suggested_description", ""),
                    suggested_tags=",".join(final_tags),
                    predicted_price_min=pricing_result["min"],
                    predicted_price_max=pricing_result["max"],
                    price_reason=pricing_result["reason"],
                    trend_score=float(data.get("trend_score", 0)),
                    trend_reason=data.get("trend_reason", ""),
                    best_selling_months=", ".join(data.get("best_months", [])) if isinstance(data.get("best_months"), list) else str(data.get("best_months")),
                    monthly_popularity=monthly_str,
                    tags_focus=str_focus,
                    tags_long_tail=str_long,
                    tags_aesthetic=str_aes,
                    tags_creative=str_creative,
                    competitor_analysis=comp_analysis
                )
                db.add(snapshot)

                if db_listing.image_url != request.image_url:
                    db_listing.image_url = request.image_url

                db_listing.lqs_score = final_lqs
                db_listing.lqs_visual_score = lqs_breakdown['visual_impulse_score']
                db_listing.lqs_seo_score = lqs_breakdown['seo_foundation_score']
                db_listing.lqs_zeitgeist_score = lqs_breakdown['zeitgeist_score']
                db_listing.lqs_reason = lqs_reason_text
                db_listing.last_analyzed_at = current_time
                db_listing.tags = final_tags
                db_listing.suggested_title = data.get("suggested_title", "")
                db_listing.suggested_description = data.get("suggested_description", "")
                db_listing.suggested_materials = data.get("materials", "")
                db_listing.suggested_styles = data.get("styles", "")
                db_listing.suggested_colors = data.get("colors", "")
                db_listing.suggested_occasions = data.get("occasions", "")
                db_listing.suggested_recipients = data.get("recipients", "")
                db_listing.suggested_faqs = "\n".join([f"Q: {i.get('q','')}\nA: {i.get('a','')}" for i in data.get("faqs", [])])
                db_listing.predicted_price_min = pricing_result["min"]
                db_listing.predicted_price_max = pricing_result["max"]
                db_listing.price_reason = pricing_result["reason"]
                db_listing.trend_score = float(data.get("trend_score", 0))
                db_listing.trend_reason = data.get("trend_reason", "")
                db_listing.best_selling_months = ", ".join(data.get("best_months", [])) if isinstance(data.get("best_months"), list) else str(data.get("best_months"))
                db_listing.monthly_popularity = monthly_str
                db_listing.tags_focus = str_focus
                db_listing.tags_long_tail = str_long
                db_listing.tags_aesthetic = str_aes
                db_listing.tags_creative = str_creative
                db_listing.competitor_analysis = comp_analysis
                db_listing.traffic_data = traffic_json
                db_listing.is_analyzed = True
                
                db.commit()
                db.refresh(db_listing)

            result_obj = get_cached_result(db_listing)
            result_obj.predicted_price_optimal = pricing_result["optimal"]
            return result_obj

    except Exception as e:
        import traceback
        with open("error.log", "a") as f:
            f.write(f"{datetime.now()}: {str(e)}\n{traceback.format_exc()}\n")
        return empty_error_result(str(e))

def get_cached_result(listing):
    optimal_derived = (listing.predicted_price_min + listing.predicted_price_max) / 2
    
    traffic_dict = {}
    try:
        if listing.traffic_data:
            traffic_dict = json.loads(listing.traffic_data)
    except:
        pass

    return AnalysisResult(
        suggested_title=listing.suggested_title,
        suggested_description=listing.suggested_description,
        suggested_tags=listing.tags,
        lqs_score=listing.lqs_score,
        lqs_visual_score=listing.lqs_visual_score,
        lqs_seo_score=listing.lqs_seo_score,
        lqs_zeitgeist_score=listing.lqs_zeitgeist_score,
        lqs_reason=listing.lqs_reason,
        suggested_materials=listing.suggested_materials,
        suggested_styles=listing.suggested_styles,
        suggested_colors=listing.suggested_colors,
        suggested_occasions=listing.suggested_occasions,
        suggested_recipients=listing.suggested_recipients,
        suggested_faqs=listing.suggested_faqs,
        predicted_price_min=listing.predicted_price_min,
        predicted_price_max=listing.predicted_price_max,
        predicted_price_optimal=optimal_derived,
        price_reason=listing.price_reason,
        trend_score=listing.trend_score,
        trend_reason=listing.trend_reason,
        best_selling_months=listing.best_selling_months,
        monthly_popularity=listing.monthly_popularity,
        tags_focus=listing.tags_focus,
        tags_long_tail=listing.tags_long_tail,
        tags_aesthetic=listing.tags_aesthetic,
        tags_creative=listing.tags_creative,
        competitor_analysis=listing.competitor_analysis,
        traffic_data=traffic_dict,
        last_analyzed_at=listing.last_analyzed_at
    )

def empty_error_result(msg):
    return AnalysisResult(
        suggested_title="Error", suggested_description=msg, suggested_tags=[], 
        lqs_score=0, lqs_visual_score=0, lqs_seo_score=0, lqs_zeitgeist_score=0, lqs_reason="Error", 
        suggested_materials="", suggested_styles="", suggested_colors="", suggested_occasions="", suggested_recipients="", 
        suggested_faqs="", predicted_price_min=0, predicted_price_max=0, predicted_price_optimal=0, price_reason="", trend_score=0, trend_reason="", 
        best_selling_months="", monthly_popularity="[]", tags_focus="", tags_long_tail="", tags_aesthetic="", tags_creative="", competitor_analysis="",
        traffic_data={}
    )