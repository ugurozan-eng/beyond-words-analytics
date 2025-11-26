# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Dosya adını etsy_v2.db yaptık
SQLALCHEMY_DATABASE_URL = "sqlite:///./etsy_v2.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)