class MockEtsyService:
    def get_mock_listing(self):
        """
        Etsy API'si çalışmadığı için simülasyon verisi döndürür.
        Örnek: Vintage bir vazo.
        """
        return {
            "listing_id": 123456789,
            "title": "Vintage Floral Vase, Hand Painted Ceramic Flower Pot, Retro Home Decor, 70s Style Bohemian Art",
            "description": "Beautiful vintage ceramic vase with hand-painted floral details. Perfect for boho home decor. Condition is excellent, no chips or cracks. Circa 1970s.",
            "state": "active",
            "url": "https://www.etsy.com/listing/123456789/vintage-vase",
            "price": {
                "amount": 4500,
                "divisor": 100,
                "currency_code": "USD"
            },
            "quantity": 1,
            "tags": ["vintage", "boho", "ceramic", "vase", "floral", "70s", "retro", "home decor"],
            "materials": ["ceramic", "paint", "glaze"],
            "views": 150,
            "num_favorers": 25,
            "images": [
                # Buraya örnek bir resim linki koyuyoruz ki AI analiz edebilsin
                "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800" 
            ]
        }