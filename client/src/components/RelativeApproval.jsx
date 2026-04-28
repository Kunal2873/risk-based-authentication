export default function RelativeApprovalStep({ onSubmit }) {
  return (
    <div>
      <h4>Waiting for Relative Approval...</h4>
      <button onClick={() => onSubmit("approved")}>
        Simulate Approval
      </button>
    </div>
  );
}