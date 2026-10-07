import sqlite3
import os  


current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir,"data.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE user (
        phone_no INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL  
        )
""")

sample_data = [
    (9999988888, "Shyam", "Trader","xyz"),
    (7892363478, "Hari", "Driver","abc"),
    ]
cursor.executemany("INSERT INTO user(phone_no, name, role, password) VALUES (?,?,?,?)",sample_data)

conn.commit()
conn.close()

print("Database table successfully seeded inside backend-app")