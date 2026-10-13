import { useCart } from "../CartContext";

export function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const defaultImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";

  return (
    <div className="cart-item-row">
      <div className="cart-item-thumb">
        <img
          src={item.imageUrl || defaultImage}
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className="cart-item-info">
        <div className="cart-item-headline">
          <h4 className="cart-item-name">{item.name}</h4>
          <span className="cart-item-category">{item.category}</span>
        </div>
        <div className="cart-item-price-unit">
          ₹{item.price?.toFixed(0)} each
          {item.preparationTime && (
            <span className="cart-item-time"> • ⏱ {item.preparationTime} min</span>
          )}
        </div>
      </div>

      <div className="cart-item-qty-actions">
        <div className="qty-control cart-qty">
          <button
            type="button"
            className="qty-btn"
            onClick={() => decreaseQuantity(item.id)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="qty-count">{item.quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => increaseQuantity(item.id)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="cart-item-total">
          ₹{(item.price * item.quantity).toFixed(0)}
        </div>

        <button
          type="button"
          className="cart-remove-btn"
          onClick={() => removeFromCart(item.id)}
          title="Remove item"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default CartItem;
