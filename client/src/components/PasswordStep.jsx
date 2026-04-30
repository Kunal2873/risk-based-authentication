import { useState } from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#111827"
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px"
  },
  button: {
    alignSelf: "flex-start",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default function PasswordStep({ onSubmit, loading = false }) {
  const [password, setPassword] = useState("");

  return (
    <div style={styles.wrapper}>
      <h4 style={styles.title}>Password Verification</h4>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        placeholder="Enter password"
      />
      <button type="button" onClick={() => onSubmit(password)} disabled={loading} style={styles.button}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
