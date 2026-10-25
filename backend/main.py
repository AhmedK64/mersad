import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# Explicitly load the .env file from the backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Mersad Backend", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon speed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Google GenAI client using the loaded environment variables
client = genai.Client()

class SecurityQuery(BaseModel):
    prompt: str

@app.get("/")
def health_check():
    return {"status": "online", "system": "Mersad Backend API"}

@app.post("/api/analyze")
def analyze_security(query: SecurityQuery):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"You are a cybersecurity expert AI for the Mersad platform. Analyze this query: {query.prompt}",
        )
        return {"analysis": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))