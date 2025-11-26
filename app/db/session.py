# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Eğer Postgres ayarları varsa (ve localhost değilse) onu kullan
if settings.POSTGRES_SERVER != "localhost":
     SQLALCHEMY_DATABASE_URL = settings.SQLALCHEMY_DATABASE_URI
     connect_args = {}
else:
     SQLALCHEMY_DATABASE_URL = "sqlite:///./etsy_v2.db"
     connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)