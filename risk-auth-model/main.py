import json
import sys
from pathlib import Path

from src.predict import predict_risk


def run(transaction: dict) -> dict:
    return predict_risk(transaction)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_arg = sys.argv[1]
        raw_input = Path(input_arg).read_text() if Path(input_arg).exists() else input_arg
    else:
        raw_input = sys.stdin.read()
    transaction = json.loads(raw_input)
    print(json.dumps(run(transaction), indent=2))
