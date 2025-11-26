import os

# Oluşturulacak klasör yapısı
folders = [
    "app/api/v1/endpoints",
    "app/core",
    "app/db",
    "app/models",
    "app/schemas",
    "app/services",
    "app/utils",
    "tests"
]

# Oluşturulacak boş dosyalar
files = [
    "requirements.txt",
    ".env",
    "docker-compose.yml",
    "Dockerfile",
    "app/__init__.py",
    "app/main.py",
    "app/api/__init__.py",
    "app/api/v1/__init__.py",
    "app/api/v1/api.py",
    "app/api/v1/endpoints/auth.py",
    "app/api/v1/endpoints/shops.py",
    "app/api/v1/endpoints/listings.py",
    "app/core/config.py",
    "app/core/security.py",
    "app/db/session.py",
    "app/db/base.py",
    "app/models/user.py",
    "app/models/shop.py",
    "app/models/listing.py",
    "app/models/snapshot.py",
    "app/models/__init__.py",
    "app/services/etsy_client.py",
    "app/services/ai_service.py",
    "app/services/auth_service.py",
    "app/services/sync_service.py"
]

print("🚀 Proje iskeleti oluşturuluyor...")

# Klasörleri oluştur
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"✅ Klasör oluşturuldu: {folder}")

# Dosyaları oluştur
for file in files:
    if not os.path.exists(file):
        with open(file, 'w', encoding='utf-8') as f:
            pass  # Boş dosya yarat
        print(f"📄 Dosya oluşturuldu: {file}")
    else:
        print(f"ℹ️  Dosya zaten var: {file}")

print("\n✨ İŞLEM TAMAMLANDI! Tüm dosyalar hazır.")