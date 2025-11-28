```python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import os

# Render'dan gelen DATABASE_URL'i al
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render postgres:// veriyor, SQLAlchemy postgresql:// istiyor
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    connect_args = {}
else:
    # Local geliştirme için fallback
    SQLALCHEMY_DATABASE_URL = "sqlite:///./etsy_v2.db"
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```