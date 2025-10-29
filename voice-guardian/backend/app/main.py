from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import auth, voice, actions

# Initialize database
init_db()

app = FastAPI(title="Voice Guardian API", version="0.1.0")

# CORS - Allow frontend, web app, and Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend
        "http://localhost:3000",  # Web App
        "chrome-extension://*",   # Chrome extensions
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(voice.router, prefix="/voice", tags=["voice"])
app.include_router(actions.router, prefix="/actions", tags=["actions"])

@app.get("/")
def root():
    return {"message": "Voice Guardian API", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
