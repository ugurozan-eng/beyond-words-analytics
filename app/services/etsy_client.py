import httpx
from app.core.config import settings

class EtsyClient:
    def __init__(self, access_token: str = None):
        self.base_url = "https://api.etsy.com/v3"
        self.headers = {"x-api-key": settings.ETSY_KEY_STRING}
        if access_token:
            self.headers["Authorization"] = f"Bearer {access_token}"

    async def get_shop_details(self, shop_name: str):
        """Mağaza detaylarını getirir"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/application/shops",
                params={"shop_name": shop_name},
                headers=self.headers
            )
            return response.json()

    async def get_active_listings(self, shop_id: int, limit: int = 100):
        """Aktif ürünleri getirir"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/application/shops/{shop_id}/listings/active",
                params={"limit": limit},
                headers=self.headers
            )
            return response.json()