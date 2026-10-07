import sqlite3
import os  


current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir,"data.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("""
    CREATE OR REPLACE TABLE user(
    phone_no int NOT NULL
    name TEXT NOT NULL
    role TEXT NOT NULL
    password TEXT NOT NULL  
    )
""")
sapmle_data = [
    (9999988888, "ABC", "Trader","xyz"),
    (7892363478, "DEF", "Driver","abc"),
    ]
cursor.executemany("INSERT INTO user(phone_no, name, role, password) VALUES (?,?,?,?)",)

conn.commit()
conn.close()

print("Database table successfully seeded inside backend-app")