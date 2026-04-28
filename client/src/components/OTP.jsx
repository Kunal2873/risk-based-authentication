export default function OtpStep({ onSubmit }) {
  const [otp, setOtp] = useState("");

  return (
    <div>
      <h4>Enter OTP</h4>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={() => onSubmit(otp)}>Verify</button>
    </div>
  );
}