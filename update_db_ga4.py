from sqlalchemy import text
from app.db.session import engine

def add_column(table_name, column_name, column_type):
    with engine.connect() as conn:
        try:
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}"))
            print(f"Added column {column_name} to {table_name}")
        except Exception as e:
            print(f"Column {column_name} might already exist or error: {e}")

print("Updating database schema for GA4...")
add_column("settings", "ga4_property_id", "VARCHAR")
add_column("settings", "ga4_measurement_id", "VARCHAR")
add_column("settings", "ga4_client_secret", "VARCHAR")
print("Database schema updated.")
