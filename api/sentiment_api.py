import os
import uuid
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
import google.generativeai as genai
from textblob import TextBlob

# Load environment variables
load_dotenv(dotenv_path=".env")
api_key = os.getenv("GOOGLE_API_KEY")
print("🔑 API Key loaded:", api_key)

genai.configure(api_key=api_key)

# 📋 List all available models
print("\n📋 Available models:")
for m in genai.list_models():
    print(f"- {m.name}: {m.supported_generation_methods}")

model = genai.GenerativeModel("models/gemini-pro")

app = FastAPI()

# Input models
class MoodRequest(BaseModel):
    mood: str
    age: int
    gender: str
    session_id: str

class UserInfo(BaseModel):
    age: int
    gender: str

# Sentiment classifier
def get_sentiment_label(text: str) -> str:
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.2:
        return "positive"
    elif polarity < -0.2:
        return "negative"
    else:
        return "neutral"

# Register endpoint
@app.post("/register")
async def register_user(data: UserInfo):
    session_id = str(uuid.uuid4())
    return JSONResponse(content={"session_id": session_id})

# Mood analysis endpoint
@app.post("/generate-response/")
async def generate_response(data: MoodRequest):
    print("\n📥 Incoming request:")
    print("Mood:", data.mood)
    print("Age:", data.age)
    print("Gender:", data.gender)

    mood = data.mood.strip().lower()
    sentiment = get_sentiment_label(mood)
    print("📊 Detected sentiment:", sentiment)

    if sentiment == "negative":
        prompt = (
            f"Hey Gemini! The user is a {data.age}-year-old {data.gender} college student and they said: '{data.mood}'. "
            "Please write a warm, uplifting, and empathetic message to support them. Then, suggest 2–3 realistic, cost-effective activities they can do to feel better. "
            "Make the message sound like a caring friend. Keep emoji use friendly and tasteful — one per suggestion is perfect."
        )
    elif sentiment == "positive":
        prompt = (
            f"Hey Gemini! The user is a {data.age}-year-old {data.gender} college student and they said: '{data.mood}'. "
            "Celebrate this positive energy with a fun, cheerful message. Then suggest 2–3 uplifting activities they can do to keep the good vibes going or spread them to others. "
            "Feel free to use emojis — one per suggestion is great!"
        )
    else:
        prompt = (
            f"The user is a {data.age}-year-old {data.gender} college student and they said: '{data.mood}'. "
            "The mood seems a little neutral or unclear. Write a thoughtful and slightly positive message to gently encourage them. "
            "Also recommend 2 small but meaningful things they can do today to reflect or reset. Use calm, warm tone and limit emojis to one per suggestion."
        )

    print("📝 Final prompt:", prompt)

    try:
        response = model.generate_content(prompt)
        print("✅ Gemini raw response:", response)
        message = response.text if hasattr(response, 'text') else response.parts[0].text
        return {
            "message": message,
            "sentiment": sentiment
        }
    except Exception as e:
        print("❌ Gemini error:", e)
        return {"error": str(e)}

# Stub for mood history
@app.get("/entries/{session_id}")
async def get_entries(session_id: str):
    return [
        {"_id": "1", "emotion": "Happy"},
        {"_id": "2", "emotion": "Sad"},
        {"_id": "3", "emotion": "Happy"},
    ]