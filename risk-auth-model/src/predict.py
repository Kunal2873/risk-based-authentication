import json
from pathlib import Path

import joblib
import pandas as pd


FEATURE_COLUMNS = [
    "amount",
    "known_device",
    "trusted_beneficiary",
    "normal_location",
    "new_beneficiary",
    "unusual_time",
    "new_device",
    "first_time_beneficiary",
    "rapid_transactions",
    "is_senior",
]

RISK_LABELS = {0: "low", 1: "medium", 2: "high"}
REQUIRED_AUTH = {
    "low": ["otp"],
    "medium": ["otp", "questionnaire"],
    "high": ["otp", "questionnaire", "relative_email_otp"],
}

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "risk_model.pkl"
MODEL = joblib.load(MODEL_PATH)


def predict_risk(transaction: dict) -> dict:
    features = pd.DataFrame([{column: transaction[column] for column in FEATURE_COLUMNS}])

    prediction = int(MODEL.predict(features)[0])
    probabilities = MODEL.predict_proba(features)[0]
    class_index = list(MODEL.classes_).index(prediction)
    risk_level = RISK_LABELS[prediction]

    triggered_signals = []
    if transaction["amount"] > 1000:
        triggered_signals.append("amount")
    if transaction["known_device"] == 0:
        triggered_signals.append("known_device")
    if transaction["trusted_beneficiary"] == 0:
        triggered_signals.append("trusted_beneficiary")
    if transaction["normal_location"] == 0:
        triggered_signals.append("normal_location")
    if transaction["new_beneficiary"] == 1:
        triggered_signals.append("new_beneficiary")
    if transaction["unusual_time"] == 1:
        triggered_signals.append("unusual_time")
    if transaction["new_device"] == 1:
        triggered_signals.append("new_device")
    if transaction["first_time_beneficiary"] == 1:
        triggered_signals.append("first_time_beneficiary")
    if transaction["rapid_transactions"] == 1:
        triggered_signals.append("rapid_transactions")
    if transaction["is_senior"] == 1:
        triggered_signals.append("is_senior")

    return {
        "risk_level": risk_level,
        "risk_score": round(float(probabilities[class_index]), 4),
        "required_auth": REQUIRED_AUTH[risk_level],
        "triggered_signals": triggered_signals,
        "is_senior": bool(transaction["is_senior"]),
    }


if __name__ == "__main__":
    sample_transactions = [
        {
            "amount": 75.0,
            "known_device": 1,
            "trusted_beneficiary": 1,
            "normal_location": 1,
            "new_beneficiary": 0,
            "unusual_time": 0,
            "new_device": 0,
            "first_time_beneficiary": 0,
            "rapid_transactions": 0,
            "is_senior": 0,
        },
        {
            "amount": 2500.0,
            "known_device": 0,
            "trusted_beneficiary": 0,
            "normal_location": 0,
            "new_beneficiary": 1,
            "unusual_time": 1,
            "new_device": 1,
            "first_time_beneficiary": 1,
            "rapid_transactions": 1,
            "is_senior": 1,
        },
    ]

    for transaction in sample_transactions:
        print(json.dumps(predict_risk(transaction), indent=2))
