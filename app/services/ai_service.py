import json
import openai
from app.core.config import settings

class HybridSEOService:
    def __init__(self):
        # TEK MOTOR: Hem Göz (Vision) hem Kalem (Yazar) olarak GPT-4o kullanıyoruz
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze_image(self, image_url: str) -> dict:
        """
        1. AŞAMA: Görsel Analiz
        """
        try:
            print("👀 AI (Göz): Görsel taranıyor...")
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this product image for Etsy. Return JSON: style, main_colors, materials, vibe, suggested_occasion."},
                            {"type": "image_url", "image_url": {"url": image_url}}
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"❌ Hata (Görsel): {e}")
            return {}

    async def generate_seo_content(self, current_title: str, visual_data: dict) -> dict:
        """
        2. AŞAMA: SEO Metni (Bunu da GPT-4o yapacak)
        """
        try:
            print("✍️ AI (Yazar): SEO metni hazırlanıyor...")
            
            visual_summary = json.dumps(visual_data)
            
            system_prompt = """
            You are a top-tier Etsy SEO Specialist.
            Task: Write a high-converting Title, Description, and 13 Tags.
            
            Rules:
            1. Tags must be comma-separated, max 20 chars each.
            2. Title must be keyword-rich but readable.
            3. Output MUST be valid JSON: {"title": "...", "description": "...", "tags": "tag1, tag2, tag3..."}
            """
            
            user_message = f"Product Title: {current_title}\nVisual Analysis: {visual_summary}\n\nOptimize this listing!"

            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                response_format={"type": "json_object"},
                max_tokens=1000
            )
            
            return json.loads(response.choices[0].message.content)

        except Exception as e:
            print(f"❌ Hata (Metin): {e}")
            return {}