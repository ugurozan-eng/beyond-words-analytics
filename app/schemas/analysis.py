from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    image_url: str
    product_title: str = "New Product" # Eğer başlık girilmezse varsayılan bu olsun