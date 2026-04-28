from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import run
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Transaction(BaseModel):
    amount: float
    known_device: int
    trusted_beneficiary: int
    normal_location: int
    new_beneficiary: int
    unusual_time: int
    new_device: int
    first_time_beneficiary: int
    rapid_transactions: int
    is_senior: int


@app.post("/predict")
def predict(payload: Transaction):
    return run(payload.model_dump())


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
