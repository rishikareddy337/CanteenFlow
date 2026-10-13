export function Loading({ message = "Loading delicious canteen meals..." }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img"></div>
          <div className="skeleton-body">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line desc"></div>
            <div className="skeleton-line price"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;
