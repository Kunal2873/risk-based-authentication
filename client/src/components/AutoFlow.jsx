import { useEffect, useRef, useState } from "react";
import { verifyStep } from "../api/api";
import OtpStep from "./OTP";
import SecurityQuestionStep from "./SecurityQuestions";

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "24px"
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "12px"
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "20px"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb"
  },
  title: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#111827"
  },
  caption: {
    margin: "0 0 20px",
    color: "#4b5563"
  },
  message: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px"
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca"
  },
  successCard: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "20px"
  },
  resetButton: {
    marginTop: "16px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer"
  }
};

const formatStep = (step) =>
  step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AuthFlow({ flowData, userId, onReset, onComplete }) {
  const [currentStep, setCurrentStep] = useState(flowData.step);
  const [requiredAuth] = useState(flowData.required_auth);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentRelativeOtpRef = useRef(false);

  const handleSubmit = async (input) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await verifyStep({
        step: currentStep,
        input,
        userId,
        required_auth: requiredAuth
      });

      if (currentStep === "relative_email_otp" && data.success && data.message === "OTP sent") {
        return;
      }

      if (data.completed) {
        if (onComplete) {
          onComplete();
          return;
        }

        setCompleted(true);
        return;
      }

      if (data.success) {
        setCurrentStep(data.next_step);
      } else {
        setError("Verification failed. Please check the input and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while verifying the current step.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep !== "relative_email_otp") {
      sentRelativeOtpRef.current = false;
      return;
    }

    if (sentRelativeOtpRef.current) {
      return;
    }

    sentRelativeOtpRef.current = true;

    const sendRelativeOtp = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await verifyStep({
          step: "relative_email_otp",
          input: "",
          userId,
          required_auth: requiredAuth
        });

        if (!data.success) {
          setError("Verification failed. Please check the input and try again.");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while verifying the current step.");
      } finally {
        setLoading(false);
      }
    };

    sendRelativeOtp();
  }, [currentStep, requiredAuth, userId]);

  const currentIndex = requiredAuth.indexOf(currentStep);
  const progressIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
  const progressWidth = requiredAuth.length
    ? `${Math.max(progressIndex, completed ? requiredAuth.length : 0) / requiredAuth.length * 100}%`
    : "0%";

  const renderStep = () => {
    switch (currentStep) {
      case "otp":
        return <OtpStep onSubmit={handleSubmit} loading={loading} />;

      case "questionnaire":
        return <SecurityQuestionStep onSubmit={handleSubmit} loading={loading} />;

      case "relative_email_otp":
        return (
          <OtpStep
            onSubmit={handleSubmit}
            loading={loading}
            label="Enter OTP sent to relative's email"
          />
        );

      default:
        return (
          <div style={{ ...styles.message, ...styles.error }}>
            Unsupported authentication step: {currentStep}
          </div>
        );
    }
  };

  if (completed) {
    return (
      <div style={styles.successCard}>
        <h3 style={{ marginTop: 0, color: "#166534" }}>Transaction Successful</h3>
        <p style={{ margin: 0, color: "#166534" }}>
          All required authentication steps have been completed successfully.
        </p>
        <button type="button" onClick={onReset} style={styles.resetButton}>
          Start Another Transaction
        </button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.progressMeta}>
        <h3 style={styles.title}>Authentication Flow</h3>
        <span style={{ color: "#4b5563", fontSize: "14px" }}>
          Step {progressIndex || 1} of {requiredAuth.length || 1}
        </span>
      </div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: progressWidth }} />
      </div>
      <p style={styles.caption}>Current step: {formatStep(currentStep)}</p>
      {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
      {renderStep()}
    </div>
  );
}
