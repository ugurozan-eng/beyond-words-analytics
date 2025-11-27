import sys
import os
from sqlalchemy import select, text

# Windows path fix
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.listing import Listing

def check_listings():
    print("🔍 Checking database for listings...")
    db = SessionLocal()
    try:
        listings = db.query(Listing).all()
        
        print(f"📊 Total Listings Found: {len(listings)}")
        print("-" * 40)
        
        for listing in listings:
            print(f"ID: {listing.id}")
            print(f"Title: {listing.title}")
            print(f"Image URL: {listing.image_url}")
            print("-" * 20)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_listings()
