import { useState } from "react";
import { startTransaction } from "../api/api";
import AuthFlow from "../components/AutoFlow";

export const TransactionPage = () => {
  const [flowData, setFlowData] = useState(null);

  const start = async () => {
    const res = await startTransaction({
      amount: 500,
      known_device: 1,
      trusted_beneficiary: 0,
      normal_location: 1,
      new_beneficiary: 1,
      unusual_time: 0,
      new_device: 0,
      first_time_beneficiary: 0,
      rapid_transactions: 0,
      is_senior: 0
    });

    setFlowData(res.data);
  };

  return (
    <div>
      <h2>Risk-Based Transaction</h2>

      <button onClick={start}>Start Transaction</button>

      {flowData && (
        <AuthFlow flowData={flowData} userId="USER_ID_HERE" />
      )}
    </div>
  );
}