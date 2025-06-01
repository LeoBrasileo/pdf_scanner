from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router)

@app.get("/")
def read_root():
    return {"message": "base"}
