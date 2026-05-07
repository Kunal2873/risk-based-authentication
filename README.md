# SecurePay - Risk-Based Authentication Payment Gateway

A mock payment gateway that uses an XGBoost ML model to score transaction risk in real time and triggers the appropriate number of authentication steps based on that risk level.

Built as a Final Year Academic Project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite (port 5173) |
| Backend | Node.js + Express (port 3000) |
| ML API | FastAPI + XGBoost (port 5000) |
| Database | MongoDB |
| Email OTP | Nodemailer + Gmail SMTP |

---

## Project Structure

```text
Final_year_Project/
|- client/          # React frontend
|- backend/         # Node/Express server (entry: index.js)
`- risk-auth-model/ # ML API (entry: api.py)
```

---

## How to Run

Open 3 separate terminals:

**Terminal 1 - ML API**
```bash
cd risk-auth-model
venv\Scripts\activate
python api.py
```

**Terminal 2 - Backend**
```bash
cd backend
node index.js
```

**Terminal 3 - Frontend**
```bash
cd client
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## How It Works

### Flow
```text
Login -> Payment Form -> Risk Scoring -> Auth Steps -> Success
```

### Risk Levels & Authentication

| Risk Level | Example Amount | Auth Steps |
|------------|---------------|------------|
| Low | ~$50 | OTP only |
| Medium | ~$500 | OTP + Security Questions |
| High | ~$2000 | OTP + Security Questions + Relative Email OTP |

### Risk Features Sent to ML Model

- `known_device` / `new_device` - device familiarity
- `trusted_beneficiary` / `new_beneficiary` / `first_time_beneficiary` - recipient history
- `normal_location` - geolocation check via Haversine formula (>50km flagged as unusual)
- `unusual_time` - transactions between 11pm and 6am are flagged
- `rapid_transactions` - multiple quick payments flag
- `is_senior` - senior users get additional authentication

---

## ML Model - XGBoost

XGBoost builds decision trees sequentially where each tree corrects errors of the previous one.

**Why XGBoost:**
- Best performance on tabular/structured data with binary features
- Handles class imbalance (fraud is rare) via `scale_pos_weight`
- Provides feature importance - explainable to examiners
- Millisecond inference - suitable for real-time payment risk scoring
- Industry validated - used by PayPal, Stripe, and major banks

**Why not other models:**
- Logistic Regression - too simple, misses non-linear feature interactions
- Random Forest - good but slower and less accurate here
- Neural Network - overkill for 9 binary features, hard to explain in viva

---

## Demo Login Credentials

| Username | Password |
|----------|----------|
| kunal | kunal@99 |
| nakul | nakul@13 |
| prakhar | prakhar@30 |
| kaushal | kaushal@92 |
| mohak | mohak@07 |

---

## Pages

1. **Login** - authenticate with credentials above
2. **Payment Form** - enter recipient, account number, amount
3. **Auth Flow** - risk-based authentication steps
4. **Success** - transaction receipt

---

> Academic project - not for production use.
