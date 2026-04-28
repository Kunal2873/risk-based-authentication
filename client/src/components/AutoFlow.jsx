import { useState } from "react";
import { verifyStep } from "../api/api";

import SecurityQuestionStep from "./SecurityQuestions";

export default function AuthFlow({ flowData, userId }) {
  const [currentStep, setCurrentStep] = useState(flowData.step);
  const [requiredAuth] = useState(flowData.required_auth);

  const handleSubmit = async (input) => {
    try {
      const res = await verifyStep({
        step: currentStep,
        input,
        userId,
        required_auth: requiredAuth
      });

      if (res.data.completed) {
        alert("✅ Transaction Successful");
        return;
      }

      if (res.data.success) {
        setCurrentStep(res.data.next_step);
      } else {
        alert("❌ Invalid input");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const renderStep = () => {
   switch (currentStep) {
  case "otp":
    return <OtpStep onSubmit={handleSubmit} />;

  case "security_question":
    return <SecurityQuestionStep onSubmit={handleSubmit} />;

  case "relative_approval":
    return <RelativeApprovalStep onSubmit={handleSubmit} />;
}
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Current Step: {currentStep}</h3>
      {renderStep()}
    </div>
  );
}