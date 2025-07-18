from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import uvicorn
from services.roadmap_service import generate_roadmap
import logging
from pydantic import BaseModel
import json
from groq import Groq

class GoalRequest(BaseModel):
    goal: str

class ChatRequest(BaseModel):
    message: str
    context: str = "roadmap_assistant"
    
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="EduGo API",
    description="API for generating learning roadmaps",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"]
)

@app.get("/")
async def root():
    return {"message": "Welcome to EduGo Backend!"}

@app.post("/generate-roadmap")
async def create_roadmap(request: GoalRequest):
    try:
        logger.info(f"Generating roadmap for goal: {request.goal}")
        roadmap_data = generate_roadmap(request.goal)
        
        # Ensure the response has the correct structure
        if not isinstance(roadmap_data, dict):
            raise ValueError("AI returned non-dictionary response")
            
        if "roadmap" not in roadmap_data:
            logger.error(f"Missing 'roadmap' key in response: {roadmap_data}")
            raise ValueError("AI response missing 'roadmap' field")
            
        if not isinstance(roadmap_data["roadmap"], list):
            logger.error(f"Roadmap is not a list: {roadmap_data['roadmap']}")
            raise ValueError("Roadmap should be a list of steps")
            
        # Ensure each step has substeps
        for step in roadmap_data["roadmap"]:
            if "substeps" not in step or not isinstance(step["substeps"], list):
                logger.error(f"Invalid step structure: {step}")
                raise ValueError("Each roadmap step must have 'substeps' list")
        
        return JSONResponse(
            content={"roadmap": roadmap_data["roadmap"]},
            status_code=200
        )
        
    except Exception as e:
        logger.error(f"Roadmap generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):  # Using Pydantic model for validation
    try:
        # Initialize Groq client with error handling
        api_key = os.environ.get("REACT_APP_GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")

        client = Groq(api_key=api_key)
        
        # Create chat completion with proper error handling
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert coding mentor. Provide clear, concise answers "
                               "about learning roadmaps and study paterns."
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.7,
            max_tokens=500,
            timeout=30  # Add timeout
        )
        
        if not response.choices:
            raise HTTPException(status_code=500, detail="Empty response from AI")
            
        return {"response": response.choices[0].message.content}
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
