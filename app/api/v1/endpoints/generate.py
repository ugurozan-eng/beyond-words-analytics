from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import json
import traceback

router = APIRouter()

class GenerateRequest(BaseModel):
    description: str
    image_base64: Optional[str] = None

class PriceSuggestion(BaseModel):
    min: float
    max: float
    recommended: float

class GenerateResponse(BaseModel):
    seo_title: str
    tags: List[str]
    description: str
    price_suggestion: PriceSuggestion
    image_prompt: str

@router.post("/", response_model=GenerateResponse)
async def generate_listing(
    description: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = """
        Sen bir Etsy SEO uzmanısın. Aşağıdaki ürün için SEO uyumlu İngilizce Başlık, 13 Etiket, Satış Odaklı Açıklama, Fiyat Tahmini ve Görsel Promptu oluştur. Yanıtı SADECE geçerli bir JSON formatında ver.

        JSON Şeması:
        {
            "seo_title": "...",
            "tags": ["tag1", "tag2", ...],
            "description": "...",
            "price_suggestion": {
                "min": 10.0,
                "max": 20.0,
                "recommended": 15.0
            },
            "image_prompt": "..."
        }
        """

        content = [prompt, f"Ürün Açıklaması: {description}"]

        if image:
            # Read image content
            image_content = await image.read()
            content.append({
                "mime_type": image.content_type,
                "data": image_content
            })

        response = model.generate_content(content)
        
        # Clean response text to ensure valid JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        
        data = json.loads(text.strip())
        
        return GenerateResponse(**data)

    except Exception as e:
        print(f"Generation Error: {str(e)}")
        traceback.print_exc()
        # Fallback to mock data on error
        return GenerateResponse(
            seo_title="Error generating content - Fallback Title",
            tags=["error", "fallback"],
            description="An error occurred while generating content. Please try again.",
            price_suggestion={"min": 0, "max": 0, "recommended": 0},
            image_prompt="Error generating prompt"
        )
