import { useState } from "react";
import { saveTransaction, startTransaction } from "../api/api";
import AuthFlow from "../components/AutoFlow";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a"
  },
  shell: {
    maxWidth: "760px",
    margin: "0 auto"
  },
  brand: {
    marginBottom: "20px"
  },
  brandName: {
    margin: 0,
    fontSize: "34px",
    fontWeight: 700,
    color: "#0f172a"
  },
  brandTag: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: "15px"
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3ee",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)"
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "24px"
  },
  sectionText: {
    margin: "0 0 24px",
    color: "#475569",
    lineHeight: 1.5
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  fullWidth: {
    gridColumn: "1 / -1"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155"
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px"
  },
  button: {
    marginTop: "24px",
    padding: "13px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer"
  },
  message: {
    marginTop: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px"
  },
  error: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c"
  },
  authPage: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  authShell: {
    width: "100%",
    maxWidth: "760px"
  },
  successCard: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "16px",
    padding: "28px"
  },
  successTitle: {
    margin: "0 0 10px",
    fontSize: "26px",
    color: "#166534"
  },
  successText: {
    margin: "0 0 20px",
    color: "#166534"
  },
  details: {
    display: "grid",
    gap: "12px",
    marginTop: "10px"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "10px",
    borderBottom: "1px solid #dcfce7"
  },
  detailLabel: {
    color: "#166534",
    fontWeight: 600
  },
  detailValue: {
    color: "#14532d",
    textAlign: "right"
  },
  secondaryButton: {
    marginTop: "24px",
    padding: "13px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#166534",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer"
  }
};

const defaultRiskPayload = {
  known_device: 1,
  trusted_beneficiary: 0,
  normal_location: 1,
  new_beneficiary: 1,
  unusual_time: 0,
  new_device: 0,
  first_time_beneficiary: 0,
  rapid_transactions: 0,
  is_senior: 0
};

const createTransactionId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8).toUpperCase();
  }

  return Math.random().toString(36).slice(2, 10).toUpperCase();
};

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error)
    );
  });

export default function PaymentPage() {
  const [page, setPage] = useState("form");
  const [paymentForm, setPaymentForm] = useState({
    userId: "USER_ID_HERE",
    recipient: "",
    accountNumber: "",
    amount: ""
  });
  const [flowData, setFlowData] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFlowData(null);
    setPaymentReceipt(null);

    try {
      const currentHour = new Date().getHours();
      const unusual_time = currentHour >= 23 || currentHour < 6 ? 1 : 0;
      let normal_location = 1;

      try {
        const { latitude, longitude } = await getCurrentLocation();
        const savedHomeLat = localStorage.getItem("home_lat");
        const savedHomeLng = localStorage.getItem("home_lng");

        if (savedHomeLat && savedHomeLng) {
          const distanceKm = calculateDistanceKm(
            Number(savedHomeLat),
            Number(savedHomeLng),
            latitude,
            longitude
          );

          normal_location = distanceKm > 50 ? 0 : 1;
        } else {
          localStorage.setItem("home_lat", String(latitude));
          localStorage.setItem("home_lng", String(longitude));
          normal_location = 1;
        }
      } catch (locationError) {
        console.warn("Unable to fetch location, defaulting to normal location.", locationError);
        normal_location = 1;
      }

      const { data } = await startTransaction({
        amount: Number(paymentForm.amount),
        ...defaultRiskPayload,
        normal_location,
        unusual_time
      });

      setFlowData(data);
      setPage("auth");
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to analyze payment risk right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPage("form");
    setFlowData(null);
    setPaymentReceipt(null);
    setError("");
  };

  const handleComplete = async () => {
    await saveTransaction({
      userId: paymentForm.userId,
      recipient: paymentForm.recipient,
      accountNumber: paymentForm.accountNumber,
      amount: Number(paymentForm.amount),
      riskLevel: flowData?.risk_level,
      authSteps: flowData?.required_auth
    });

    setPaymentReceipt({
      transactionId: createTransactionId(),
      recipient: paymentForm.recipient,
      amount: Number(paymentForm.amount),
      timestamp: new Date().toLocaleString()
    });
    setFlowData(null);
    setPage("success");
  };

  if (page === "auth") {
    return (
      <div style={styles.authPage}>
        <div style={styles.authShell}>
          {flowData && (
            <AuthFlow
              flowData={flowData}
              userId={paymentForm.userId}
              onReset={handleReset}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    );
  }

  if (page === "success" && paymentReceipt) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.brand}>
            <h1 style={styles.brandName}>SecurePay</h1>
            <p style={styles.brandTag}>Protected payments with adaptive authentication</p>
          </div>

          <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Payment Successful</h2>
            <p style={styles.successText}>
              Your payment was completed after successful risk-based authentication.
            </p>

            <div style={styles.details}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Transaction ID</span>
                <span style={styles.detailValue}>{paymentReceipt.transactionId}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Recipient</span>
                <span style={styles.detailValue}>{paymentReceipt.recipient}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Amount</span>
                <span style={styles.detailValue}>${paymentReceipt.amount.toFixed(2)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Timestamp</span>
                <span style={styles.detailValue}>{paymentReceipt.timestamp}</span>
              </div>
            </div>

            <button type="button" onClick={handleReset} style={styles.secondaryButton}>
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.brand}>
          <h1 style={styles.brandName}>SecurePay</h1>
          <p style={styles.brandTag}>Protected payments with adaptive authentication</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Payment Gateway</h2>
          <p style={styles.sectionText}>
            Enter payment details below. SecurePay will run a risk analysis and ask for the required authentication steps before completing the transfer.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={{ ...styles.field, ...styles.fullWidth }}>
                <label htmlFor="recipient" style={styles.label}>Recipient Name</label>
                <input
                  id="recipient"
                  name="recipient"
                  type="text"
                  value={paymentForm.recipient}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="accountNumber" style={styles.label}>Account Number</label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={paymentForm.accountNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="amount" style={styles.label}>Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ ...styles.field, ...styles.fullWidth }}>
                <label htmlFor="userId" style={styles.label}>User ID</label>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={paymentForm.userId}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Analyzing Risk..." : "Proceed Securely"}
            </button>
          </form>

          {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
