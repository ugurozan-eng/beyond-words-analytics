from sqlalchemy import Column, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base 

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    price = Column(Float)
    image_url = Column(String)
    
    listing_type = Column(String, default="mine") 
    competitor_analysis = Column(String, default="") 
    
    is_analyzed = Column(Boolean, default=False)
    
    # --- LQS 3.1 PUANLAMA SİSTEMİ ---
    lqs_score = Column(Float, default=0.0) # Toplam Puan
    lqs_visual_score = Column(Float, default=0.0) # Modül 1
    lqs_seo_score = Column(Float, default=0.0)    # Modül 2
    lqs_zeitgeist_score = Column(Float, default=0.0) # Modül 3
    lqs_reason = Column(String, default="") 
    # --------------------------------
    
    last_analyzed_at = Column(DateTime(timezone=True), nullable=True)

    suggested_title = Column(String, default="")
    suggested_description = Column(String, default="")
    
    suggested_materials = Column(String, default="")
    suggested_styles = Column(String, default="")
    suggested_colors = Column(String, default="")
    suggested_occasions = Column(String, default="")
    suggested_recipients = Column(String, default="")
    
    suggested_faqs = Column(String, default="") 
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
    
    traffic_data = Column(String, default="{}") # JSON String

    _tags = Column("tags", String, default="")

    @property
    def tags(self):
        if not self._tags: return []
        return [tag.strip() for tag in self._tags.split(",")]

    @tags.setter
    def tags(self, value):
        if not value: self._tags = ""
        elif isinstance(value, list): self._tags = ",".join(value)
        else: self._tags = str(value)