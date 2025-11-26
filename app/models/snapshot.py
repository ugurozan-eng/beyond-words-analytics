from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class ListingSnapshot(Base):
    __tablename__ = "listing_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # LQS 3.1
    lqs_score = Column(Float)
    lqs_visual_score = Column(Float, default=0.0)
    lqs_seo_score = Column(Float, default=0.0)
    lqs_zeitgeist_score = Column(Float, default=0.0)
    
    lqs_reason = Column(String)
    suggested_title = Column(String)
    suggested_description = Column(String)
    suggested_tags = Column(String)
    
    predicted_price_min = Column(Float, default=0.0)
    predicted_price_max = Column(Float, default=0.0)
    price_reason = Column(String, default="")
    trend_score = Column(Float, default=0.0)
    trend_reason = Column(String, default="")
    best_selling_months = Column(String, default="")
    
    monthly_popularity = Column(String, default="")
    tags_focus = Column(String, default="")
    tags_long_tail = Column(String, default="")
    tags_aesthetic = Column(String, default="")
    tags_creative = Column(String, default="")
    
    competitor_analysis = Column(String, default="")