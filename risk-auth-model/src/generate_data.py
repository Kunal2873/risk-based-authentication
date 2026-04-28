from pathlib import Path

import numpy as np
import pandas as pd


def generate_low_risk(count: int) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "amount": np.random.uniform(1, 99, count),
            "known_device": np.ones(count, dtype=int),
            "trusted_beneficiary": np.ones(count, dtype=int),
            "normal_location": np.ones(count, dtype=int),
            "new_beneficiary": np.random.randint(0, 2, count),
            "unusual_time": np.random.randint(0, 2, count),
            "new_device": np.zeros(count, dtype=int),
            "first_time_beneficiary": np.zeros(count, dtype=int),
            "rapid_transactions": np.zeros(count, dtype=int),
            "is_senior": np.random.randint(0, 2, count),
            "risk_level": np.zeros(count, dtype=int),
        }
    )


def generate_medium_risk(count: int) -> pd.DataFrame:
    new_device = np.random.randint(0, 2, count)
    normal_location = np.where(new_device == 1, 1, np.random.randint(0, 2, count))

    return pd.DataFrame(
        {
            "amount": np.random.uniform(100, 1000, count),
            "known_device": np.random.randint(0, 2, count),
            "trusted_beneficiary": np.random.randint(0, 2, count),
            "normal_location": normal_location,
            "new_beneficiary": np.random.randint(0, 2, count),
            "unusual_time": np.random.randint(0, 2, count),
            "new_device": new_device,
            "first_time_beneficiary": np.zeros(count, dtype=int),
            "rapid_transactions": np.zeros(count, dtype=int),
            "is_senior": np.random.randint(0, 2, count),
            "risk_level": np.ones(count, dtype=int),
        }
    )


def generate_high_risk(count: int) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "amount": np.random.uniform(1000.01, 5000, count),
            "known_device": np.random.randint(0, 2, count),
            "trusted_beneficiary": np.random.randint(0, 2, count),
            "normal_location": np.random.randint(0, 2, count),
            "new_beneficiary": np.random.randint(0, 2, count),
            "unusual_time": np.random.randint(0, 2, count),
            "new_device": np.random.randint(0, 2, count),
            "first_time_beneficiary": np.random.randint(0, 2, count),
            "rapid_transactions": np.random.randint(0, 2, count),
            "is_senior": np.random.randint(0, 2, count),
            "risk_level": np.full(count, 2, dtype=int),
        }
    )


def main() -> None:
    np.random.seed(42)
    data = pd.concat(
        [
            generate_low_risk(3500),
            generate_medium_risk(3500),
            generate_high_risk(3000),
        ],
        ignore_index=True,
    )
    data = data.sample(frac=1, random_state=42).reset_index(drop=True)

    output_path = Path(__file__).resolve().parent.parent / "data" / "transactions.csv"
    data.to_csv(output_path, index=False)


if __name__ == "__main__":
    main()
