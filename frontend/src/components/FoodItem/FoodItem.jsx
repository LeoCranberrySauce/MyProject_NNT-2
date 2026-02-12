import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const formatCurrency1 = (value) => {
  return `PHP ${parseFloat(value).toFixed(2)}`;
};

const FoodItem = ({id,name,size,price,description,image,stock}) => {

    const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);
    const [showPopup, setShowPopup] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Add safety check for cartItems and stock
    const itemCount = cartItems ? cartItems[id] || 0 : 0;
    const stockValue = stock || 0; // Ensure stock is a number
    const remainingStock = stockValue - itemCount;

    // Determine if item is out of stock
    const isOutOfStock = remainingStock <= 0;

    const handleAddToCart = () => {
      addToCart(id, quantity);
      setQuantity(1);
      setShowPopup(false);
    };

    const handleQuantityChange = (value) => {
      const numValue = parseInt(value) || 1;
      const maxQuantity = Math.max(remainingStock, 1);
      if (numValue > 0 && numValue <= maxQuantity) {
        setQuantity(numValue);
      }
    };

    const incrementQuantity = () => {
      if (quantity < remainingStock) {
        setQuantity(quantity + 1);
      }
    };

    const decrementQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

  return (
    <>
      <div className='food-item'>
        <div className="food-item-img-container" onClick={() => !isOutOfStock && setShowPopup(true)}>
          <img src={url+"/images/"+image} alt="" className="food-item-image" />
          {isOutOfStock ? (
            <div className="out-of-stock-badge">Out of Stock</div>
          ) : (
            <div className="view-details-badge">Click the image to add to cart</div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
              <p>{name} {size && `(${size})`}</p>
              <img src={assets.rating_starts} alt="" />
          </div>
          <p className='food-item-desc'>{description}</p>
          <p className='food-item-price'>{formatCurrency1(price)}</p>
          <p className={`food-item-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {isOutOfStock ? 'Out of Stock' : `Available: ${remainingStock}`}
          </p>
        </div>
      </div>

      {/* Food Item Popup Modal */}
      {showPopup && (
        <div className="food-item-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="food-item-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-close" onClick={() => setShowPopup(false)}>×</div>
            <div className="popup-content">
              <div className="popup-image">
                <img src={url+"/images/"+image} alt={name} />
              </div>
              <div className="popup-details">
                <h2>{name} {size && `(${size})`}</h2>
                <div className="popup-rating">
                  <img src={assets.rating_starts} alt="" />
                </div>
                <p className="popup-description">{description}</p>
                <p className="popup-price">{formatCurrency1(price)}</p>
                <p className={`popup-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
                  {isOutOfStock ? 'Out of Stock' : `Available: ${remainingStock}`}
                </p>
                
                {!isOutOfStock && (
                  <>
                    <div className="popup-quantity-section">
                      <label htmlFor="quantity">Number of Pieces:</label>
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={decrementQuantity}>−</button>
                        <input 
                          type="number" 
                          id="quantity"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          min="1"
                          max={remainingStock}
                        />
                        <button className="qty-btn" onClick={incrementQuantity}>+</button>
                      </div>
                    </div>
                    <button className="popup-add-to-cart-btn" onClick={handleAddToCart}>
                      Add {quantity} to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FoodItem
