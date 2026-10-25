import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

# Configure Google Gemini API key
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

app = FastAPI(
    title="Mersad API",
    description="AI-Powered Cybersecurity Threat & Scam Analyzer"
)

# Enable CORS so your React frontend (port 5173) can communicate with FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/api/analyze")
def analyze_message(payload: AnalyzeRequest):
    try:
        if not api_key:
            return {
                "risk_level": "HIGH",
                "threat_type": "Configuration Warning",
                "reasons": "GEMINI_API_KEY is missing from your environment variables or .env file.",
                "recommendation": "Add your Gemini API key to your backend .env file to enable live AI analysis."
            }

        # Initialize the updated Gemini model compatible with current API versions
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""
        You are Mersad (مرصاد), an expert cybersecurity AI assistant that analyzes suspicious messages, emails, links, or texts for scams, phishing, and social engineering threats.
        
        Analyze the following text provided by the user and respond strictly in valid JSON format with these exact keys:
        - "risk_level": Must be exactly one of "LOW", "MEDIUM", or "HIGH"
        - "threat_type": A short description of the threat category (e.g., "Phishing Scam", "Fake Banking Alert", "Safe / Legitimate Message")
        - "reasons": Clear, concise bullet-style explanation of why this message is suspicious or safe.
        - "recommendation": Actionable advice for the user on what precautions to take.

        Text to analyze:
        \"\"\"{payload.text}\"\"\"
        
        Return ONLY valid JSON. Do not include extra commentary outside the JSON structure.
        """

        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        
        # Strip markdown formatting wrappers if Gemini includes them
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        result_json = json.loads(raw_text)
        return result_json

    except Exception as e:
        print(f"Error during analysis: {e}")
        return {
            "risk_level": "MEDIUM",
            "threat_type": "Processing Error",
            "reasons": f"An error occurred while communicating with the Gemini AI engine: {str(e)}",
            "recommendation": "Check your API key validity and internet connection, then try again."
        }