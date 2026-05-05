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
    color: "#1a1a2e"
  },
  input: {
    padding: "10px 12px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1a1a2e",
    outline: "none"
  },
  button: {
    alignSelf: "flex-start",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#00b074",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default function OtpStep({ onSubmit, loading = false, label = "Enter OTP" }) {
  const [otp, setOtp] = useState("");

  return (
    <div style={styles.wrapper}>
      <h4 style={styles.title}>{label}</h4>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={styles.input}
        placeholder="Enter code"
      />
      <button type="button" onClick={() => onSubmit(otp)} disabled={loading} style={styles.button}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
