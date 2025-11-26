# app/models/shop.py
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    shop_name = Column(String)
    
    # "Listings" ilişkisini sildik. Artık ürün aramıyor.