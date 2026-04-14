from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import (
    order_collection, 
    cake_type_collection, 
    message_collection, 
    admin_collection, # Added this
    OrderSchema, 
    CakeTypeSchema, 
    MessageSchema,
    AdminAuth # Added this
)
from bson import ObjectId
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. INITIALIZE ADMIN (Run once if DB is empty)
@app.on_event("startup")
async def setup_admin():
    admin = await admin_collection.find_one({"type": "credentials"})
    if not admin:
        await admin_collection.insert_one({
            "type": "credentials",
            "username": "admin",
            "password": "123" 
        })

# 2. ADMIN LOGIN ROUTE
@app.post("/admin/login")
async def admin_login(auth: AdminAuth):
    admin = await admin_collection.find_one({"type": "credentials"})
    if auth.username == admin["username"] and auth.password == admin["password"]:
        return {"status": "success"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# 3. UPDATE SECURITY ROUTE
@app.put("/admin/update-security")
async def update_security(auth: AdminAuth):
    await admin_collection.update_one(
        {"type": "credentials"},
        {"$set": {"username": auth.username, "password": auth.password}}
    )
    return {"message": "Security updated successfully"}

# --- MENU ROUTES ---
@app.get("/cake-types")
async def get_cakes():
    cakes = []
    async for cake in cake_type_collection.find():
        cake["_id"] = str(cake["_id"])
        cakes.append(cake)
    return cakes

@app.post("/cake-types")
async def add_cake(cake: CakeTypeSchema):
    await cake_type_collection.insert_one(cake.dict())
    return {"status": "success"}

@app.put("/cake-types/{cake_id}")
async def update_cake(cake_id: str, cake: CakeTypeSchema):
    await cake_type_collection.update_one(
        {"_id": ObjectId(cake_id)},
        {"$set": cake.dict()}
    )
    return {"message": "Updated"}

@app.delete("/cake-types/{cake_id}")
async def delete_cake(cake_id: str):
    await cake_type_collection.delete_one({"_id": ObjectId(cake_id)})
    return {"message": "Deleted"}

# --- MESSAGE ROUTES ---
@app.post("/messages")
async def send_message(msg: MessageSchema):
    msg_dict = msg.dict()
    msg_dict["timestamp"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    await message_collection.insert_one(msg_dict)
    return {"status": "success"}

@app.get("/admin/messages")
async def get_messages():
    msgs = []
    async for m in message_collection.find().sort("_id", -1):
        m["_id"] = str(m["_id"])
        msgs.append(m)
    return msgs

# --- ORDER ROUTES ---
@app.post("/orders")
async def create_order(order: OrderSchema):
    await order_collection.insert_one(order.dict())
    return {"status": "success", "ref": order.ref_number}

@app.get("/admin/orders")
async def get_all_orders():
    orders = []
    async for order in order_collection.find():
        order["_id"] = str(order["_id"])
        orders.append(order)
    return orders

@app.get("/orders/{ref_num}")
async def get_order_status(ref_num: str):
    order = await order_collection.find_one({"ref_number": ref_num})
    if order:
        return {"status": order["status"]}
    return {"status": "Not Found"}

@app.put("/admin/orders/{ref_num}")
async def update_order_status(ref_num: str, status: str):
    await order_collection.update_one(
        {"ref_number": ref_num}, 
        {"$set": {"status": status}}
    )
    return {"message": "Status updated"}