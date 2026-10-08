import sqlite3
import os

# Get absolute path to the database file in the same directory
db_path = os.path.join(os.path.dirname(_file_), "data.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.executemany("INSERT INTO price_table (price_from, price_to, weight_from, weight_to) VALUES (500, 1000, 50, 100), (700, 1300, 101, 150), (900, 1600, 151, 200), (1100, 1900, 201, 250), (1300, 2200, 251, 300), (1500, 2500, 301, 350), (1700, 2800, 351, 400), (1900, 3100, 401, 450), (2100, 3400, 451, 500), (2300, 3700, 501, 550), (2500, 4000, 551, 600);")
except sqlite3.IntegrityError:
    print("Unable to insert rows")


conn.close()