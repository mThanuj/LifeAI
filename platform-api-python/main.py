from fastapi import FastAPI
from routes.ask_route import router as ask_router

app = FastAPI(title="File-based Q&A API")

# Include routes
app.include_router(ask_router, prefix="/api")
