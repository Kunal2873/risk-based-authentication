import { useState } from "react";
import { startTransaction } from "../api/api";
import AuthFlow from "../components/AutoFlow";

const booleanFields = [
  { name: "known_device", label: "Known device" },
  { name: "trusted_beneficiary", label: "Trusted beneficiary" },
  { name: "normal_location", label: "Normal location" },
  { name: "new_beneficiary", label: "New beneficiary" },
  { name: "unusual_time", label: "Unusual time" },
  { name: "new_device", label: "New device" },
  { name: "first_time_beneficiary", label: "First-time beneficiary" },
  { name: "rapid_transactions", label: "Rapid transactions" },
  { name: "is_senior", label: "Senior customer" }
];

const initialForm = {
  userId: "USER_ID_HERE",
  amount: 500,
  known_device: "yes",
  trusted_beneficiary: "no",
  normal_location: "yes",
  new_beneficiary: "yes",
  unusual_time: "no",
  new_device: "no",
  first_time_beneficiary: "no",
  rapid_transactions: "no",
  is_senior: "no"
};

const styles = {
  page: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 20px 48px",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)"
  },
  title: {
    margin: "0 0 8px",
    fontSize: "28px"
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#4b5563",
    lineHeight: 1.5
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: 600,
    fontSize: "14px"
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px"
  },
  actions: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },
  button: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer"
  },
  message: {
    marginTop: "16px",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px"
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca"
  },
  summary: {
    marginTop: "24px",
    display: "grid",
    gap: "16px"
  },
  summaryCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px"
  },
  list: {
    margin: "8px 0 0",
    paddingLeft: "20px"
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase"
  }
};

const formatStep = (step) =>
  step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const TransactionPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [flowData, setFlowData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const start = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFlowData(null);

    try {
      const payload = {
        amount: Number(formData.amount),
        known_device: formData.known_device === "yes" ? 1 : 0,
        trusted_beneficiary: formData.trusted_beneficiary === "yes" ? 1 : 0,
        normal_location: formData.normal_location === "yes" ? 1 : 0,
        new_beneficiary: formData.new_beneficiary === "yes" ? 1 : 0,
        unusual_time: formData.unusual_time === "yes" ? 1 : 0,
        new_device: formData.new_device === "yes" ? 1 : 0,
        first_time_beneficiary: formData.first_time_beneficiary === "yes" ? 1 : 0,
        rapid_transactions: formData.rapid_transactions === "yes" ? 1 : 0,
        is_senior: formData.is_senior === "yes" ? 1 : 0
      };

      const { data } = await startTransaction(payload);
      setFlowData(data);
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to start the transaction. Please check the API and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFlowData(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Risk-Based Transaction</h2>
        <p style={styles.subtitle}>
          Submit a transaction and review the risk level and authentication steps returned by the backend.
        </p>

        <form onSubmit={start}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label htmlFor="userId" style={styles.label}>User ID</label>
              <input
                id="userId"
                name="userId"
                type="text"
                value={formData.userId}
                onChange={handleChange}
                style={styles.input}
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
                value={formData.amount}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {booleanFields.map((field) => (
              <div key={field.name} style={styles.field}>
                <label htmlFor={field.name} style={styles.label}>{field.label}</label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Starting..." : "Start Transaction"}
            </button>
          </div>
        </form>

        {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}

        {flowData && (
          <div style={styles.summary}>
            <div style={styles.summaryCard}>
              <div style={{ marginBottom: "10px" }}>
                <span style={styles.badge}>{flowData.risk_level || "Unknown Risk"}</span>
              </div>
              <strong>Required Authentication Steps</strong>
              <ul style={styles.list}>
                {flowData.required_auth?.map((step) => (
                  <li key={step}>{formatStep(step)}</li>
                ))}
              </ul>
            </div>

            <AuthFlow
              flowData={flowData}
              userId={formData.userId}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
};
