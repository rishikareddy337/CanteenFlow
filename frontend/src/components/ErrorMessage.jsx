export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message || "Could not connect to the CanteenFlow server. Please check your connection."}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try Again ↺
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
