from pydantic import BaseModel
from typing import Optional

class SettingsBase(BaseModel):
    etsy_keystring: Optional[str] = ""
    etsy_shared_secret: Optional[str] = ""
    etsy_shop_id: Optional[str] = ""
    
    ga4_property_id: Optional[str] = ""
    ga4_measurement_id: Optional[str] = ""
    ga4_client_secret: Optional[str] = ""

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True
