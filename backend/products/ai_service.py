import os
from openai import OpenAI
from dotenv import load_dotenv
from .models import Product

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def get_ai_response(user_query, chat_history=[]):
    # Fetch real product data for accurate context
    products = Product.objects.all()
    product_list = "\n".join([
        f"- ID: {p.id}, {p.brand} {p.name}, Price: ${p.price}, Stock: {p.stock}, Link: http://localhost:3000/{p.category}/"
        for p in products
    ])

    system_prompt = f"""
    You are the 'Ralph Lauren Smart Assistant'. Your purpose is to provide REAL information about our products and help with orders.
    
    Current LIVE Inventory:
    {product_list}
    
    CRITICAL RULES:
    1. ONLY suggest products from the "Current LIVE Inventory" above. Do NOT make up products.
    2. Respond like a luxury concierge: professional, warm, and elite.
    3. If asked about price or stock, use the exact values provided in the list.
    4. If the user asks for a recommendation, pick the most relevant items from our inventory.
    5. Always mention that guests can checkout by providing their shipping info, but members get free shipping.
    6. Keep responses under 150 words. Use formatting for readability.
    7. Language: Respond in the same language as the user (Vietnamese or English).
    """

    messages = [{"role": "system", "content": system_prompt}]
    for msg in chat_history:
        messages.append(msg)
    messages.append({"role": "user", "content": user_query})

    if client is None:
        return "The AI assistant is not configured yet. Please add OPENAI_API_KEY in the backend environment variables."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.4, # Lower temperature for higher accuracy
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"AI Error: {e}")
        return "I apologize, our digital concierge is currently indisposed. Please contact our support team at support@ralphlauren.com"
