# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.v1.api import api_router
import os

# --- KRİTİK DÜZELTME: KLASÖR KONTROLÜ EN BAŞTA YAPILMALI ---
# Uygulama "mount" etmeden önce klasörün var olduğundan emin oluyoruz.
if not os.path.exists("uploads"):
    os.makedirs("uploads")
    print("✅ 'uploads' klasörü manuel olarak oluşturuldu.")
# -----------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Beyond Words Analytics Platformu Başlatılıyor...")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Veritabanı Tabloları Hazır.")
    except Exception as e:
        print(f"❌ Veritabanı Hatası: {e}")
        
    yield
    print("🛑 Sistem Kapatılıyor...")

app = FastAPI(

@app.get("/")
async def root():
    return {
        "message": "Beyond Words Studio API Çalışıyor!",
        "status": "active"
    }