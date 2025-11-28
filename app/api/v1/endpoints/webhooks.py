from fastapi import APIRouter, Request, HTTPException, Header
import hmac
import hashlib
import os
import json
from app.db.session import SessionLocal
from sqlalchemy import text

router = APIRouter()

@router.post("/lemon-squeezy")
async def lemon_squeezy_webhook(request: Request, x_signature: str = Header(None)):
    """
    Handle Lemon Squeezy Webhooks
    """
    if not x_signature:
        raise HTTPException(status_code=400, detail="Missing signature")

    # 1. Verify Signature
    secret = os.getenv("LEMON_SQUEEZY_WEBHOOK_SECRET")
    if not secret:
        print("⚠️ Webhook secret not configured")
        # In production, this should probably error, but for now we might log it.
        # raise HTTPException(status_code=500, detail="Server misconfiguration")
    
    body = await request.body()
    
    if secret:
        digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(digest, x_signature):
            raise HTTPException(status_code=401, detail="Invalid signature")

    # 2. Parse Payload
    try:
        payload = json.loads(body)
        event_name = payload.get("meta", {}).get("event_name")
        data = payload.get("data", {})
        attributes = data.get("attributes", {})
        custom_data = payload.get("meta", {}).get("custom_data", {})
        
        print(f"🔔 Webhook Received: {event_name}")

        # 3. Handle Events
        if event_name in ["subscription_created", "subscription_updated", "subscription_payment_success"]:
            user_id = custom_data.get("user_id")
            subscription_id = data.get("id")
            customer_id = attributes.get("customer_id")
            status = attributes.get("status") # active, past_due, etc.
            
            if user_id:
                await update_user_subscription(user_id, subscription_id, customer_id, status)
            else:
                print("⚠️ No user_id found in custom_data")

        elif event_name == "subscription_cancelled":
            user_id = custom_data.get("user_id")
            if user_id:
                await update_user_subscription(user_id, None, None, "cancelled")

    except Exception as e:
        print(f"❌ Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Error processing webhook")

    return {"status": "received"}

async def update_user_subscription(user_id: str, sub_id: str, cust_id: str, status: str):
    """
    Update user profile in Supabase via direct SQL or ORM
    """
    print(f"🔄 Updating User {user_id}: Status={status}")
    
    # Map Lemon Squeezy status to our internal status
    # active, on_trial, past_due, cancelled, expired
    internal_status = "free"
    if status in ["active", "on_trial"]:
        internal_status = "pro"
    
    try:
        # Using raw SQL for simplicity with Supabase connection
        db = SessionLocal()
        sql = text("""
            UPDATE public.profiles 
            SET subscription_status = :status, 
                subscription_id = :sub_id, 
                customer_id = :cust_id
            WHERE id = :user_id
        """)
        
        db.execute(sql, {
            "status": internal_status,
            "sub_id": sub_id,
            "cust_id": cust_id,
            "user_id": user_id
        })
        db.commit()
        print("✅ User subscription updated successfully")
    except Exception as e:
        print(f"❌ Database Update Error: {e}")
    finally:
        db.close()
