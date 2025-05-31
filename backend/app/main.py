from fastapi import FastAPI
from app.routes import pdf

app = FastAPI()

app.include_router(pdf.router)

@app.get("/")
def read_root():
    return {"message": "base"}
