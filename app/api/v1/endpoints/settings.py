from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.settings import Settings
from app.schemas.settings import SettingsUpdate, SettingsResponse

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        # Create default settings if not exists
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(settings_in: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
    
    if settings_in.etsy_keystring is not None:
        settings.etsy_keystring = settings_in.etsy_keystring
    if settings_in.etsy_shared_secret is not None:
        settings.etsy_shared_secret = settings_in.etsy_shared_secret
    if settings_in.etsy_shop_id is not None:
        settings.etsy_shop_id = settings_in.etsy_shop_id
        
    if settings_in.ga4_property_id is not None:
        settings.ga4_property_id = settings_in.ga4_property_id
    if settings_in.ga4_measurement_id is not None:
        settings.ga4_measurement_id = settings_in.ga4_measurement_id
    if settings_in.ga4_client_secret is not None:
        settings.ga4_client_secret = settings_in.ga4_client_secret
        
    db.commit()
    db.refresh(settings)
    return settings
