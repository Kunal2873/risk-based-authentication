import { useState } from "react";
import { saveTransaction, startTransaction } from "../api/api";
import AuthFlow from "../components/AutoFlow";

const validUsers = [
  { username: "kunal", password: "kunal@99" },
  { username: "nakul", password: "nakul@13" },
  { username: "prakhar", password: "prakhar@30" },
  { username: "kaushal", password: "kaushal@92" },
  { username: "mohak", password: "mohak@07" }
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#1a1a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  shell: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto"
  },
  brand: {
    marginBottom: "20px"
  },
  brandHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  brandName: {
    margin: 0,
    fontSize: "34px",
    fontWeight: 700,
    color: "#00b074"
  },
  brandTag: {
    margin: "6px 0 0",
    color: "#888888",
    fontSize: "15px"
  },
  badgeRow: {
    display: "flex",
    gap: "20px",
    marginTop: "12px",
    fontSize: "12px",
    color: "#888888",
    flexWrap: "wrap"
  },
  badgeItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0"
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
    color: "#1a1a2e"
  },
  sectionText: {
    margin: "0 0 24px",
    color: "#888888",
    lineHeight: 1.5
  },
  paymentIndicators: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    opacity: 0.5
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
    color: "#1a1a2e"
  },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
    outline: "none"
  },
  inputWithAdornment: {
    paddingLeft: "28px"
  },
  inputWrap: {
    position: "relative"
  },
  inputAdornment: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#888888",
    fontSize: "14px",
    fontWeight: 600
  },
  button: {
    marginTop: "24px",
    padding: "13px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#00b074",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%"
  },
  message: {
    marginTop: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px"
  },
  error: {
    backgroundColor: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000"
  },
  authPage: {
    minHeight: "100vh",
    background: "#f0f2f5",
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
    background: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)"
  },
  successTitle: {
    margin: "0 0 10px",
    fontSize: "26px",
    color: "#00b074"
  },
  successText: {
    margin: "0 0 20px",
    color: "#888888"
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
    borderBottom: "1px solid #e0e0e0"
  },
  detailLabel: {
    color: "#888888",
    fontWeight: 600
  },
  detailValue: {
    color: "#1a1a2e",
    textAlign: "right"
  },
  secondaryButton: {
    marginTop: "24px",
    padding: "13px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#00b074",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%"
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
  const [page, setPage] = useState("login");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });
  const [loggedInUsername, setLoggedInUsername] = useState("");
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

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const matchedUser = validUsers.find(
      (user) =>
        user.username === loginForm.username &&
        user.password === loginForm.password
    );

    if (!matchedUser) {
      setError("Invalid username or password.");
      return;
    }

    setLoggedInUsername(matchedUser.username);
    setPaymentForm((current) => ({
      ...current,
      userId: matchedUser.username
    }));
    setError("");
    setPage("form");
  };

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

  if (page === "login") {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.brand}>
            <div style={styles.brandHeader}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" fill="#00b074" opacity="0.3"/><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" stroke="#00b074" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h1 style={styles.brandName}>SecurePay</h1>
            </div>
            <p style={styles.brandTag}>Protected payments with adaptive authentication</p>
            <div style={styles.badgeRow}>
              <div style={styles.badgeItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="11" width="14" height="10" rx="2" stroke="#00b074" strokeWidth="1.5"/></svg>
                <span>256-bit Encrypted</span>
              </div>
              <div style={styles.badgeItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L5 6v5c0 4.08 2.91 7.9 7 8.82 4.09-.92 7-4.74 7-8.82V6l-7-3z" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Fraud Protected</span>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Login</h2>
            <p style={styles.sectionText}>Sign in to continue to your secure payment flow.</p>

            <form onSubmit={handleLogin}>
              <div style={styles.formGrid}>
                <div style={{ ...styles.field, ...styles.fullWidth }}>
                  <label htmlFor="username" style={styles.label}>Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={{ ...styles.field, ...styles.fullWidth }}>
                  <label htmlFor="password" style={styles.label}>Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={styles.button}>
                Login
              </button>
            </form>

            {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
          </div>
        </div>
      </div>
    );
  }

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
            <div style={styles.brandHeader}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" fill="#00b074" opacity="0.3"/><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" stroke="#00b074" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h1 style={styles.brandName}>SecurePay</h1>
            </div>
            <p style={styles.brandTag}>Protected payments with adaptive authentication</p>
            <div style={styles.badgeRow}>
              <div style={styles.badgeItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="11" width="14" height="10" rx="2" stroke="#00b074" strokeWidth="1.5"/></svg>
                <span>256-bit Encrypted</span>
              </div>
              <div style={styles.badgeItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L5 6v5c0 4.08 2.91 7.9 7 8.82 4.09-.92 7-4.74 7-8.82V6l-7-3z" stroke="#00b074" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Fraud Protected</span>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Payment Gateway</h2>
            <p style={styles.sectionText}>
              Enter payment details below. SecurePay will run a risk analysis and ask for the required authentication steps before completing the transfer.
            </p>

            <div style={styles.paymentIndicators}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#94a3b8" strokeWidth="1.5"/><path d="M3 10h18" stroke="#94a3b8" strokeWidth="1.5"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8.5a4.5 4.5 0 0 1 0 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/><path d="M17 6a8 8 0 0 1 0 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 11.5a1.5 1.5 0 0 1 0 1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 20V9l6-4 6 4v11" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 13h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>

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
                <label htmlFor="amount" style={styles.label}>Amount (USD)</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputAdornment}>$</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={handleChange}
                    style={{ ...styles.input, ...styles.inputWithAdornment }}
                    required
                  />
                </div>
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
