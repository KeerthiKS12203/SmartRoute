import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="[*]",
    allow_headers="[*]",
    allow_methods="[*]",
)

def get_db():
    db_path=os.path.jsoin(os.path.dirname(os.path.abspath(__file__)), "data.db")
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

    
