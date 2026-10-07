import sqlite3
import os  


current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir,"data.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS user (
        phone_no INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL  
        )
""")

print("load table")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS load (
        load_id INTEGER PRIMARY KEY AUTOINCREMENT,
        trader_phno INTEGER NOT NULL,
        item TEXT,
        weight INTEGER,
        source TEXT NOT NULL,
        desti TEXT NOT NULL, 
        depart_by TEXT,
        arrive_by TEXT,
        timestamp TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S', 'now', '-5 hours')),
        match_id TEXT,

        FOREIGN KEY (trader_phno) REFERENCES user(phone_no)
        )
""")

print("trip table")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS trip (
        trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
        driver_phno INTEGER NOT NULL,
        vehicle_no TEXT,
        weight INTEGER,
        source TEXT NOT NULL,
        desti TEXT NOT NULL, 
        available_from TEXT,
        depart_by TEXT,
        timestamp TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S', 'now', '-5 hours')),
        match_id TEXT,

        FOREIGN KEY (driver_phno) REFERENCES user(phone_no)
        )
""")

print("load_trip_match table")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS user (
        match_id INTEGER PRIMARY KEY AUTOINCREMENT,
        trader_phno INTEGER PRIMARY KEY,
        driver_phno INTEGER PRIMARY KEY,
        load_id INTEGER PRIMARY KEY,
        trip_id INTEGER PRIMARY KEY,
        weight INTEGER,
        match_timestamp TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S', 'now', '-5 hours')),
        price INTEGER,

        FOREIGN KEY (trader_phno) REFERENCES user(phone_no),
        FOREIGN KEY (driver_phno) REFERENCES user(phone_no),
        FOREIGN KEY (load_id) REFERENCES load(laod_id),
        FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
        )
""")

print("prices table")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS prices (
        price_timestamp TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%S', 'now', '-5 hours')),
        price_from INTEGER,
        price_to INTEGER,
        weight_from INTEGER,
        weight_to INTEGER 
        )
""")

# sample_data = [
#     (9999988888, "Shyam", "trader","xyz"),
#     (7892363478, "Hari", "driver","abc"),
#     ]
# cursor.executemany("INSERT INTO user(phone_no, name, role, password) VALUES (?,?,?,?)",sample_data)

conn.commit()
conn.close()

print("Database table successfully seeded inside backend-app")