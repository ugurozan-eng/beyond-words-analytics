from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Güvenli Model Seçimi
def get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("🛑 API Key bulunamadı!")
        return None
    
    genai.configure(api_key=api_key)
    
    try:
        # 1. Google'dan mevcut modelleri iste
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print(f"📋 Mevcut Modeller: {available_models}")

        # 2. Tercih sırasına göre kontrol et
        preferences = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro']
        
        for pref in preferences:
            for model_name in available_models:
                if pref in model_name:
                    print(f"✅ Seçilen Model: {model_name}")
                    return genai.GenerativeModel(model_name)
        
        # 3. Hiçbiri yoksa listedeki ilkini al
        if available_models:
            return genai.GenerativeModel(available_models[0])
            
    except Exception as e:
        print(f"⚠️ Model listeleme hatası: {e}. Fallback 'gemini-pro' deneniyor.")
    
    # 4. En kötü durum senaryosu
    return genai.GenerativeModel('gemini-pro')

class GenerateRequest(BaseModel):
    description: str

@router.post("/")
async def generate_listing(request: GenerateRequest):
    try:
        model = get_model()
        if not model:
            raise HTTPException(status_code=500, detail="API Key Missing")

        # ZENGİNLEŞTİRİLMİŞ & EVRENSEL SİSTEM TALİMATI
        prompt = f"""
        YOU ARE AN ELITE AI ART DIRECTOR & SEO EXPERT. Your task is to take a simple product concept and convert it into professional, high-converting assets for Etsy.

        INPUT PRODUCT (Turkish): "{request.description}"

        INSTRUCTIONS:
        1.  **TRANSLATE FIRST:** Translate the input concept into English mentally.
        2.  **SEO CONTENT (English):** Create optimization titles, tags, and a persuasive description.
        3.  **PRICING STRATEGY (Neuro-Pricing):** ANALYZE PRODUCT TYPE FOR PRICING: If it's a digital/impulse product, use 'Charm Pricing' (ending in .90, .95, .99). If it's luxury/art, use whole numbers. Provide a range.
        4.  **IMAGE PROMPTS (English - CRITICAL):**
            * **NEVER** write simple prompts. You must hallucinate details.
            * **Style A (Photorealistic):** Describe a high-end commercial photoshoot. Mention camera type (e.g., Sony A7IV), lens (e.g., 50mm f/1.4), lighting (e.g., softbox, natural window light), textures, and background setting explicitly.
            * **Style B (Lifestyle Mockup):** Describe a cozy, aspirational real-life setting. Place the product naturally in a beautiful home. Mention vibes (e.g., "hygge", "minimalist", "boho"), time of day, and atmospheric details.
            * **ASPECT RATIO:** Do NOT use `--ar 4:3`. Instead, write exactly "The image is a horizontal photograph with a 4:3 aspect ratio." at the end of each prompt sentence.
        5.  **COMPETITOR SIMULATION:** Based on your knowledge of Etsy trends, generate 3 REALISTIC competitor listings that would rank high for this product. Estimate their monthly sales based on market demand.

        OUTPUT FORMAT (Strict JSON):
        {{
            "seo_title": "SEO Optimized English Title (Max 140 chars)",
            "tags": ["tag1", "tag2", "tag3", ... 13 tags total],
            "description": "Sales oriented description in English...",
            "pricing": {{
                "suggested": "9.99",
                "min": "7.00",
                "max": "12.00",
                "currency": "$"
            }},
            "competitors": [
                {{
                    "shop_name": "ExampleShopName",
                    "title": "Short Competitor Title...",
                    "price": "$15.00",
                    "sales_estimate": "120 sales/mo",
                    "tags": ["tag1", "tag2", "tag3"],
                    "differentiator": "Why this sells well (e.g. 'Great photography')"
                }},
                ... (Total 3 items)
            ],
            "image_prompt": {{
                "image_prompt_a": "A detailed, professional studio photograph of [ENGLISH OBJECT] with [SPECIFIC DETAILS, LIGHTING, CAMERA INFO]. The image is a horizontal photograph with a 4:3 aspect ratio.",
                "image_prompt_b": "A warm, candid lifestyle photograph of [ENGLISH OBJECT] placed in a [SPECIFIC SETTING, VIBE, ATMOSPHERE]. The image is a horizontal photograph with a 4:3 aspect ratio."
            }}
        }}
        """

        response = model.generate_content(prompt)
        
        # TEMİZLİK (Sanitizer)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        
        # JSON PARSING (Güvenli Blok)
        try:
            start = raw_text.find('{')
            end = raw_text.rfind('}') + 1
            json_str = raw_text[start:end]
            data = json.loads(json_str)
        except:
            # Eğer JSON bozuksa manuel düzeltme dene veya hata fırlat
            print(f"JSON Parse Hatası. Ham metin: {raw_text}")
            raise ValueError("AI geçerli JSON üretmedi.")

        # KEY MAPPING (Hata Toleransı)
        # AI bazen farklı key isimleri kullanabilir, hepsini yakala.
        
        # Fiyat verisi güvenliği
        price_data = data.get("pricing") or {}

        final_data = {
            "seo_title": data.get("seo_title") or data.get("title") or "AI Title Generated",
            "tags": data.get("tags") or data.get("keywords") or [],
            "description": data.get("description") or "Description generated.",
            "price_info": {
                "suggested": price_data.get("suggested") or "10.00",
                "min": price_data.get("min") or "8.00",
                "max": price_data.get("max") or "12.00",
                "currency": price_data.get("currency") or "$"
            },
            "competitors": data.get("competitors") or [],
            "image_prompt": data.get("image_prompt") or {
                "image_prompt_a": "Error creating prompt A",
                "image_prompt_b": "Error creating prompt B"
            }
        }

        return final_data

    except Exception as e:
        print(f"🛑 CRITICAL ERROR: {str(e)}")
        # Frontend'in çökmemesi için hata mesajını JSON olarak dön
        return {
            "seo_title": f"Hata: {str(e)}",
            "tags": ["error"],
            "description": "Lütfen tekrar deneyin.",
            "price_suggestion": "$0",
            "image_prompt": {"image_prompt_a": "Error", "image_prompt_b": "Error"}
        }
