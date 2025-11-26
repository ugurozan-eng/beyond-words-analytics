import sqlite3

def add_column():
    try:
        conn = sqlite3.connect('etsy_v2.db')
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("PRAGMA table_info(listings)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'traffic_data' not in columns:
            print("Adding traffic_data column...")
            cursor.execute("ALTER TABLE listings ADD COLUMN traffic_data TEXT DEFAULT '{}'")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_column()
