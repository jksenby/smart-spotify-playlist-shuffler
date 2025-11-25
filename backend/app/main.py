from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tracks
import uvicorn
import os

from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Super Shuffler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(auth.router)
app.include_router(tracks.router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting FastAPI on port {port}...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)