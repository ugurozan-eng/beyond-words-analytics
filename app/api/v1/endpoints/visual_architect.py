from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os

router = APIRouter()

# --- CONFIGURATION ---
# TODO: Move to .env in production
API_KEY = "AIzaSyDd576Dohqi2wVSgxY4-A4Ak3w79ipUxRg" 

genai.configure(api_key=API_KEY)

class VisualArchitectRequest(BaseModel):
    product_title: str
    visual_concept: str
    included_objects: str
    style: str
    lighting: str

@router.post("/generate")
async def generate_prompt(request: VisualArchitectRequest):
    try:
        print(f"🎨 Visual Architect Request: {request.product_title} | Concept: {request.visual_concept}")

        # 1. SAFETY SETTINGS (BLOCK_NONE)
        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

        # 2. MODEL SELECTION
        model = genai.GenerativeModel('gemini-2.5-flash', safety_settings=safety_settings)

        # 3. DECOUPLING LOGIC (Anti-Bias)
        clean_title = request.product_title[:80]
        concept_lower = request.visual_concept.lower()
        if any(x in concept_lower for x in ["table", "desk", "flat", "floor", "ground"]):
            clean_title = clean_title.replace("wall", "").replace("Wall", "").strip()

        # 4. VAP v4.0 PROMPT
        prompt = f"""
          ACT AS: The "Visual Architect", an advanced Midjourney v6 Prompt Engine.
          GOAL: Enforce "Concept Dominance". The User's Concept is the absolute truth; the Product must adapt to it.

          INPUT DATA:
          - RAW PRODUCT: "{request.product_title}"
          - DECOUPLED PRODUCT: "{clean_title}"
          - USER CONCEPT (GOVERNOR): "{request.visual_concept}" 
          - PROPS: "{request.included_objects}"
          - STYLE: {request.style}
          - LIGHT: {request.lighting}
          
          ALGORITHM RULES (VAP v4.0):
          1. **HIERARCHY OF TRUTH (Multi-Prompting):**
             - Segment 1: The Scene/Concept (e.g. "A rustic breakfast table") gets weight ::3
             - Segment 2: The Product (e.g. "A physical art print lying flat") gets weight ::2
             - Segment 3: The Vibes/Light gets weight ::1
          
          2. **ANTI-WALL PROTOCOL:** 
             - IF User Concept implies a horizontal surface (Table, Desk, Floor), you MUST inject the negative cluster: "--no wall hanging mounted drywall vertical".
             - Describe the product as "laying flat", "resting on", or "leaning against" (if on a shelf).
          
          3. **MATERIALIZATION:** 
             - Convert "Digital/PDF" terms into physical descriptions like "Heavyweight matte paper", "Cardstock print", "Framed canvas".
          
          OUTPUT FORMAT:
          - Provide ONLY the raw prompt string.
          - Use :: notation for weights.
          - End with parameters: --ar 4:5 --style raw --v 6.0 --q 2
        """

        # 5. GENERATE
        response = model.generate_content(prompt)
        
        # 6. CLEANUP
        text = response.text
        text = text.replace("/imagine prompt:", "").replace('"', "").strip()

        return {"prompt": text}

    except Exception as e:
        print(f"🛑 Visual Architect Error: {str(e)}")
        # Return specific error codes for frontend handling
        msg = str(e)
        if "403" in msg:
            raise HTTPException(status_code=403, detail="API Key Permission Error (Backend)")
        elif "404" in msg:
            raise HTTPException(status_code=404, detail="Model Not Found (Backend)")
        else:
            raise HTTPException(status_code=500, detail=f"Generation Failed: {msg}")
