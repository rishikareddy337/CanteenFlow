import { useCart } from "../CartContext";

export function FoodCard({ food }) {
  const { addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);
  const isAvailable = food.available !== false;

  const defaultImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";

  return (
    <article className={`food-card ${!isAvailable ? "unavailable" : ""}`}>
      <div className="food-card-media">
        <img
          src={food.imageUrl || defaultImage}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="media-badges">
          {food.isVeg !== undefined && (
            <span
              className={`dietary-badge ${food.isVeg ? "veg" : "non-veg"}`}
              title={food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
            >
              <span className="dot"></span>
            </span>
          )}
          <span className="category-tag">{food.category}</span>
        </div>

        {!isAvailable && (
          <div className="sold-out-overlay">
            <span>Sold Out Today</span>
          </div>
        )}
      </div>

      <div className="food-card-body">
        <div className="food-header">
          <h3 className="food-title">{food.name}</h3>
          <span className="food-price">₹{food.price?.toFixed(0)}</span>
        </div>

        <p className="food-desc">{food.description}</p>

        <div className="food-footer">
          <div className="food-meta">
            <span className="prep-time">
              ⏱ {food.preparationTime || 10} min
            </span>
            {isAvailable ? (
              <span className="stock-status in-stock">● In Kitchen</span>
            ) : (
              <span className="stock-status out-of-stock">○ Unavailable</span>
            )}
          </div>

          <div className="food-action">
            {!isAvailable ? (
              <button disabled className="btn-add-disabled">
                Sold Out
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                className="btn-add-cart"
                onClick={() => addToCart(food)}
              >
                + Add
              </button>
            ) : (
              <div className="qty-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => decreaseQuantity(food.id)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-count">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => increaseQuantity(food.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
