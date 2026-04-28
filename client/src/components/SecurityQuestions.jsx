import { useState } from "react";

export default function SecurityQuestionStep({ onSubmit }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <h4>Security Question</h4>
      <p>What is your first school name?</p>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => onSubmit(value)}>Verify</button>
    </div>
  );
}