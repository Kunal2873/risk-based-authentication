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
  text: {
    margin: 0,
    color: "#4b5563",
    lineHeight: 1.5
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

export default function RelativeApprovalStep({ onSubmit, loading = false }) {
  return (
    <div style={styles.wrapper}>
      <h4 style={styles.title}>Relative Approval</h4>
      <p style={styles.text}>
        This step simulates an external approval. Continue when approval has been received.
      </p>
      <button type="button" onClick={() => onSubmit("approved")} disabled={loading} style={styles.button}>
        {loading ? "Submitting..." : "Simulate Approval"}
      </button>
    </div>
  );
}
