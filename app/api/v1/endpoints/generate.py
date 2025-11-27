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

        # GÜÇLENDİRİLMİŞ SİSTEM TALİMATI
        prompt = f"""
        Act as an expert Etsy SEO and Midjourney Prompt Engineer.
        
        INPUT PRODUCT: "{request.description}"

        INSTRUCTIONS:
        1. FIRST, translate the product concept into ENGLISH internally.
        2. Create SEO content based on the ENGLISH translation.
        3. Create Image Prompts based on the ENGLISH translation.
        
        OUTPUT FORMAT (Strict JSON):
        {{
            "seo_title": "SEO Optimized English Title (Max 140 chars)",
            "tags": ["tag1", "tag2", "tag3", ... 13 tags total],
            "description": "Sales oriented description in English...",
            "price_suggestion": "$XX.XX",
            "image_prompt": {{
                "image_prompt_a": "Professional studio photography of [ENGLISH OBJECT], 8k, soft lighting --ar 4:3",
                "image_prompt_b": "Lifestyle mockup of [ENGLISH OBJECT] on a wooden desk, cozy aesthetic --ar 4:3"
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
        final_data = {
            "seo_title": data.get("seo_title") or data.get("title") or "AI Title Generated",
            "tags": data.get("tags") or data.get("keywords") or [],
            "description": data.get("description") or "Description generated.",
            "price_suggestion": data.get("price_suggestion") or data.get("price") or "$10.00",
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
