import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="[*]",
    allow_headers="[*]",
    allow_methods="[*]",
)

def get_db():
    db_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.db")
    conn=sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

class UserRegister(BaseModel):
    phone_no: int
    name: str
    role: str
    password: str

class LoginRequest(BaseModel):
    phone_no: int
    password: str

class CreateLoad(BaseModel):
    trader_phno: int
    item: str
    weight: int
    source: str
    desti: str
    depart_by: datetime
    arrive_by: datetime

class CreateTrip(BaseModel):
    driver_phno: int
    vehicle_no: str
    weight: int
    source: str
    desti: str
    available_from: datetime
    depart_by: datetime

class MatchTrip(BaseModel):
    trip_id: int


@app.get("/users/check-phone/{phone_no}")
def check_phone(phone_no: int):
    conn = get_db()
    user = conn.execute("SELECT role from user where phone_no = ?", (phone_no,)).fetchone()
    conn.close()

    if user:
        return JSONResponse( content = {"exists": True})

    return JSONResponse( content = {"exists": False})

@app.post("/users/login")
def login_user(req: LoginRequest):
    conn = get_db()
    user = conn.execute("SELECT role, password from user where phone_no = ?", (req.phone_no,)).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status=404, detail = "User not found")
    if user["password"]!=req.password:
        raise HTTPException(status=400, detail = "Incorrect password")

    return JSONResponse( content = {"status": "success", "role": user["role"]})

@app.post("/users/register")
def register_user(user: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO user (phone_no, name, role, password) values (?,?,?,?)", (user.phone_no, user.name, user.role, user.password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status=400, detail = "This phone is already registered ")
    conn.close()
    return JSONResponse( content = {"message": "successfully registered", "role": user.role})

@app.post("/create/load")
def create_load(load: CreateLoad):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""INSERT INTO load (trader_phno, item, weight, source, desti, depart_by, 
        arrive_by) values (?,?,?,?,?,?,?)""", (load.trader_phno, load.item, load.weight, 
        load.source, load.desti, load.depart_by.strftime("%Y-%m-%d %H:%M:%S") if load.depart_by else None, 
        load.arrive_by.strftime("%Y-%m-%d %H:%M:%S") if load.arrive_by else None))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status=400, detail = "Unable to add the load to queue")
    conn.close()
    return JSONResponse( content = {"message": "successfully added the load to queue"})

@app.post("/create/trip")
def create_trip(trip: CreateTrip):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""INSERT INTO trip (driver_phno, vehicle_no, weight, source, desti, available_from, 
        depart_by) values (?,?,?,?,?,?,?)""", (trip.driver_phno, trip.vehicle_no, trip.weight, 
        trip.source, trip.desti, trip.available_from.strftime("%Y-%m-%d %H:%M:%S") if trip.available_from else None,
        trip.depart_by.strftime("%Y-%m-%d %H:%M:%S") if trip.depart_by else None))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status=400, detail = "Unable to add the trip to queue")
    conn.close()
    return JSONResponse( content = {"message": "successfully added the trip to queue"})



@app.get("/users/current_driver/{driver_phno}")
def fetch_trips(driver_phno: int):
    conn = get_db()
    rows = conn.execute("SELECT * from trip where driver_phno = ? and (match_id = '' or match_id is null)", (driver_phno,))
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No records found for this trip")

    return [dict(row) for row in rows]


@app.get("/users/current_load/{trader_phno}")
def fetch_loads(trader_phno: int):
    conn = get_db()
    rows = conn.execute("SELECT * from load where trader_phno = ? and (match_id = '' or match_id is null)", (trader_phno,))
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No records found for this load")

    return [dict(row) for row in rows]

@app.get("/users/match_load/{trip_id}")
def match_load(trip_id: int):
    conn = get_db()
    rows = conn.execute("""SELECT * 
                        from load l join trip t 
                        on l.source = t.source 
                        and l.desti = t.desti
                        where datetime(l.depart_by) >= datetime(t.depart_by)
                        and datetime(t.available_from) <= datetime(l.depart_by)
                        and l.weight <= t.weight
                        and (match_id = '' or match_id is null)
                        """)
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No matching trip found")

    return [dict(row) for row in rows]

@app.get("/users/history_load/{trader_phno}")
def fetch_loads(trader_phno: int):
    conn = get_db()
    rows = conn.execute("SELECT * from load where trader_phno = ? and (match_id <> '' or match_id is not null)", (trader_phno,))
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No past records found for this phone number")

    return [dict(row) for row in rows]

@app.get("/users/history_trip/{driver_phno}")
def fetch_trips(driver_phno: int):
    conn = get_db()
    rows = conn.execute("SELECT * from trip where driver_phno = ? and (match_id <> '' or match_id is not null)", (driver_phno,))
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No past records found for this phone number")

    return [dict(row) for row in rows]

@app.post("/users/match/{trip_id}")
def match_trip(mat: MatchTrip):
    conn = get_db()
    rows = conn.execute("SELECT trip_id, load_id, weight, price  from match where trip_id = ?", (mat.trip_id,)).fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status=404, detail = "NO match found")

    return [dict(row) for row in rows]