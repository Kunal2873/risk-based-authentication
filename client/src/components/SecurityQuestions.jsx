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
  prompt: {
    margin: 0,
    color: "#888888"
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

export default function SecurityQuestionStep({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    date_of_birth: "",
    mothers_maiden_name: "",
    first_school: ""
  });

  const updateField = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value
    }));
  };

  return (
    <div style={styles.wrapper}>
      <h4 style={styles.title}>Security Questions</h4>
      <p style={styles.prompt}>Answer all questions below to continue.</p>

      <input
        value={form.date_of_birth}
        onChange={updateField("date_of_birth")}
        style={styles.input}
        placeholder="DD/MM/YYYY"
      />
      <input
        value={form.mothers_maiden_name}
        onChange={updateField("mothers_maiden_name")}
        style={styles.input}
        placeholder="Mother's maiden name"
      />
      <input
        value={form.first_school}
        onChange={updateField("first_school")}
        style={styles.input}
        placeholder="First school name"
      />
      <button type="button" onClick={() => onSubmit(form)} disabled={loading} style={styles.button}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
