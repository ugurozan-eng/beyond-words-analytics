from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # API Key check
    my_api_key = "AIzaSyBnrS0t2jtZm9_Dooonyq2FU8qwydsw4X8"
    target_model = "gemini-flash-latest"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent"
    params = {"key": my_api_key}
    headers = {"Content-Type": "application/json"}

    full_prompt = f"{request.context}\n\nKullanıcı: {request.message}"

    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {"temperature": 0.7, "topP": 0.8, "topK": 40}
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params, headers=headers, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                print(f"Gemini API Error: {response.text}")
                raise HTTPException(status_code=500, detail="AI servisine ulaşılamadı. (API Key hatası olabilir)")
                
            result_json = response.json()
            try:
                candidate = result_json["candidates"][0]["content"]["parts"][0]["text"]
                return ChatResponse(response=candidate.strip())
            except (KeyError, IndexError):
                return ChatResponse(response="Üzgünüm, şu an cevap veremiyorum.")
                
    except Exception as e:
        print(f"Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
