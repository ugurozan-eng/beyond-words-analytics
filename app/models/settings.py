from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    etsy_keystring = Column(String, default="")
    etsy_shared_secret = Column(String, default="")
    etsy_shop_id = Column(String, default="")
    
    ga4_property_id = Column(String, default="", nullable=True)
    ga4_measurement_id = Column(String, default="", nullable=True)
    ga4_client_secret = Column(String, default="", nullable=True)
