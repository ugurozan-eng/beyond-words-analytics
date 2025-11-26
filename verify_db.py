from sqlalchemy.orm import Session
from app.db.session import engine
from app.models import Listing

session = Session(bind=engine)
try:
    count = session.query(Listing).count()
    print(f"Total listings found: {count}")
    if count > 0:
        first = session.query(Listing).first()
        print(f"First listing: {first.title} (ID: {first.id})")
except Exception as e:
    print(f"Error reading database: {e}")
finally:
    session.close()
