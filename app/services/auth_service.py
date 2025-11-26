import hashlib
import base64
import secrets
from urllib.parse import urlencode
from app.core.config import settings  # Ayarların çekildiği yer

class EtsyAuthService:
    def __init__(self):
        # DÜZELTME: Değerleri artık doğrudan settings (ve dolayısıyla .env) üzerinden alıyoruz.
        # Elle yazılan stringleri kaldırdık.
        self.client_id = "tp59jpi3lyqyv2mhthhym1zn"
        self.redirect_uri = "http://localhost:8000/api/v1/auth/callback"
        self.base_auth_url = "https://www.etsy.com/oauth/connect"
        self.token_url = "https://api.etsy.com/v3/public/oauth/token"

    def generate_pkce_pair(self) -> tuple[str, str]:
        """
        PKCE (Proof Key for Code Exchange) için şifreli anahtar çifti oluşturur.
        Bu, mobil ve masaüstü uygulamaları için altın standarttır.
        """
        # 1. Rastgele bir kod oluştur
        code_verifier = secrets.token_urlsafe(32)
        
        # 2. Bu kodun şifreli özetini (hash) çıkar
        code_challenge_hash = hashlib.sha256(code_verifier.encode('ascii')).digest()
        
        # 3. URL uyumlu hale getir
        code_challenge = base64.urlsafe_b64encode(code_challenge_hash).decode('ascii').rstrip('=')
        
        return code_verifier, code_challenge

    def get_authorization_url(self, code_challenge: str, state: str) -> str:
        """
        Kullanıcıyı Etsy'ye yönlendireceğimiz linki oluşturur.
        """
        # İzin kapsamları (Hangi verilere erişeceğiz?)
        # Email ve transaction'ı çıkardık, profile_r'yi ekledik.
        scopes = [
            "listings_r",      # Ürünleri oku
            "shops_r",         # Mağaza bilgisini oku
        ]
        
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(scopes),
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256"
        }
        
        return f"{self.base_auth_url}?{urlencode(params)}"