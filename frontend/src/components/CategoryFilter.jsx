const categories = [
  { name: "All", label: "All Items", icon: "🍽️" },
  { name: "Breakfast", label: "Breakfast", icon: "🥞" },
  { name: "Lunch", label: "Lunch", icon: "🍛" },
  { name: "Snacks", label: "Snacks", icon: "🍟" },
  { name: "Beverages", label: "Beverages", icon: "☕" },
  { name: "Desserts", label: "Desserts", icon: "🍨" },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter-container">
      <div className="category-filter-scroll">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              className={`category-pill ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="pill-icon">{cat.icon}</span>
              <span className="pill-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
