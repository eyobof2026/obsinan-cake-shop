import motor.motor_asyncio
from pydantic import BaseModel
from typing import Optional

# PASTE YOUR REAL CLOUD LINK HERE
MONGO_DETAILS = "mongodb+srv://saronof2026_db_user:Saron1234@cluster0.ixywm0r.mongodb.net/obsinan_db?appName=Cluster0"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.obsinan_cake_shop

# Collections
order_collection = database.get_collection("orders")
cake_type_collection = database.get_collection("cake_types")
message_collection = database.get_collection("messages")
admin_collection = database.get_collection("admin_settings") # Added this

# --- BLUEPRINTS ---

class OrderSchema(BaseModel):
    full_name: str
    phone: str
    cake_text: str
    delivery_date: str
    delivery_time: str
    cake_type: str
    price: int
    pay_method: str
    ref_number: str
    receipt_data: str
    status: str = "Pending"

class CakeTypeSchema(BaseModel):
    name: str
    price: int
    image_data: str

class MessageSchema(BaseModel):
    name: str
    phone: str
    message: str

# Added this blueprint for the Login
class AdminAuth(BaseModel):
    username: str
    password: str