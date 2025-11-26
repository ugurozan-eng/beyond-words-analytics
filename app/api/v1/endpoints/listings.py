# app/api/v1/endpoints/listings.py
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from uuid import uuid4
import shutil
import os
import json

from app.models import Listing, ListingSnapshot
from app.api.deps import get_db 

# --- Şemalar ---
class ListingSnapshotBase(BaseModel):
    id: int
    listing_id: str
    created_at: datetime
    lqs_score: float
    lqs_reason: Optional[str] = ""
    predicted_price_min: Optional[float] = 0.0
    predicted_price_max: Optional[float] = 0.0
    price_reason: Optional[str] = ""
    trend_score: Optional[float] = 0.0
    tags_focus: Optional[str] = ""
    tags_long_tail: Optional[str] = ""
    tags_aesthetic: Optional[str] = ""
    tags_creative: Optional[str] = ""
    monthly_popularity: Optional[str] = ""
    competitor_analysis: Optional[str] = ""
    
    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    id: str
    title: str
    price: float
    image_url: str
    listing_type: str = "mine" 
    competitor_analysis: Optional[str] = ""
    
    is_analyzed: bool
    lqs_score: float
    lqs_reason: Optional[str] = ""
    last_analyzed_at: Optional[datetime] = None
    
    tags: List[str] = []
    suggested_title: Optional[str] = ""
    suggested_description: Optional[str] = ""
    suggested_materials: Optional[str] = ""
    suggested_styles: Optional[str] = ""
    suggested_colors: Optional[str] = ""
    suggested_occasions: Optional[str] = ""
    suggested_recipients: Optional[str] = ""
    
    suggested_faqs: Optional[str] = ""
    predicted_price_min: Optional[float] = 0.0
    predicted_price_max: Optional[float] = 0.0
    price_reason: Optional[str] = ""

    trend_score: Optional[float] = 0.0
    trend_reason: Optional[str] = ""
    best_selling_months: Optional[str] = ""

    monthly_popularity: Optional[str] = ""
    tags_focus: Optional[str] = ""
    tags_long_tail: Optional[str] = ""
    tags_aesthetic: Optional[str] = ""
    tags_creative: Optional[str] = ""
    
    traffic_data: Optional[Dict[str, Any]] = None

    @field_validator('traffic_data', mode='before')
    def parse_traffic_data(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return {}
        return v

    class Config:
        from_attributes = True 

class NewListingRequest(BaseModel):
    title: str
    price: float
    image_url: str
    listing_type: str = "mine"

class UpdateListingRequest(BaseModel):
    suggested_title: Optional[str] = None
    suggested_description: Optional[str] = None
    tags: Optional[List[str]] = None
    suggested_materials: Optional[str] = None
    suggested_styles: Optional[str] = None
    suggested_colors: Optional[str] = None
    suggested_occasions: Optional[str] = None
    suggested_recipients: Optional[str] = None
    suggested_faqs: Optional[str] = None
    tags_focus: Optional[str] = None
    tags_long_tail: Optional[str] = None
    tags_aesthetic: Optional[str] = None
    tags_creative: Optional[str] = None

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_name = f"{uuid4()}_{file.filename}"
        file_location = f"uploads/{file_name}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        full_url = f"http://localhost:8000/uploads/{file_name}"
        return {"url": full_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ListingBase])
async def list_listings(db: Session = Depends(get_db)):
    listings = db.query(Listing).all()
    return listings

@router.post("/", response_model=ListingBase)
async def create_new_listing(new_listing: NewListingRequest, db: Session = Depends(get_db)):
    db_listing = Listing(
        id=str(uuid4()), 
        title=new_listing.title,
        price=new_listing.price,
        image_url=new_listing.image_url,
        listing_type=new_listing.listing_type, 
        competitor_analysis="",
        is_analyzed=False,
        lqs_score=0.0, lqs_reason="",
        tags=[], suggested_title="", suggested_description="",
        suggested_materials="", suggested_styles="", suggested_colors="",
        suggested_occasions="", suggested_recipients="",
        suggested_faqs="", predicted_price_min=0.0, predicted_price_max=0.0, price_reason="",
        trend_score=0.0, trend_reason="", best_selling_months="",
        monthly_popularity="", tags_focus="", tags_long_tail="", tags_aesthetic="", tags_creative="",
        traffic_data="{}"
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.delete("/{id}")
async def delete_listing(id: str, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing: raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    db.delete(listing)
    db.commit()
    return {"status": "deleted", "id": id}

@router.put("/{id}", response_model=ListingBase)
async def update_listing(id: str, update_data: UpdateListingRequest, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing: raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        if key == "tags" and value:
            listing.tags = value
        else:
            setattr(listing, key, value)

    db.commit()
    db.refresh(listing)
    return listing

@router.get("/{id}/history", response_model=List[ListingSnapshotBase])
async def get_listing_history(id: str, db: Session = Depends(get_db)):
    history = db.query(ListingSnapshot).filter(ListingSnapshot.listing_id == id).order_by(ListingSnapshot.created_at.desc()).all()
    return history