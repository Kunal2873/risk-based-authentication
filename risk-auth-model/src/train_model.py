from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier


def main() -> None:
    base_dir = Path(__file__).resolve().parent.parent
    data_path = base_dir / "data" / "transactions.csv"
    model_path = base_dir / "models" / "risk_model.pkl"

    data = pd.read_csv(data_path)
    X = data.drop(columns=["risk_level"])
    y = data["risk_level"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        random_state=42,
        eval_metric="mlogloss",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    joblib.dump(model, model_path)


if __name__ == "__main__":
    main()
