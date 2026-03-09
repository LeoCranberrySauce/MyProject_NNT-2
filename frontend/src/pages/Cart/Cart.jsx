import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    getTotalCartAmount, 
    url, 
    token,
    promoCode,
    setPromoCode,
    promoDiscount,
    promoError,
    promoApplied,
    applyPromoCode,
    removePromoCode,
    getDiscountedTotal
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");

  const handleCheckout = () => {
    if (!token) {
      // Show login popup
      const event = new CustomEvent('showLoginPopup');
      window.dispatchEvent(event);
    } else {
      navigate('/order');
    }
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput("");
    }
  };

  const handlePromoRemove = () => {
    removePromoCode();
  };

  const formatCurrency3 = (value) => {
    return `PHP ${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className='cart' id='cart-section'>
      <h1>My Cart</h1>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatCurrency3(item.price)}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{formatCurrency3(item.price * cartItems[item._id])}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatCurrency3(getTotalCartAmount())}</p>
            </div>
            {promoApplied && promoDiscount > 0 && (
              <div className="cart-total-details">
                <p>Promo Discount ({Math.round(promoDiscount * 100)}%)</p>
                <p>- {formatCurrency3(getTotalCartAmount() * promoDiscount)}</p>
              </div>
            )}
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{formatCurrency3(getTotalCartAmount()===0?0:(promoDiscount === 1 ? 0 : 2))}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{formatCurrency3(getDiscountedTotal())}</b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here to get discounts and perks!</p>
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder='Enter the promo code' 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoError && <p className="promo-error">{promoError}</p>}
            {promoApplied && (
              <div className="promo-applied">
                <p className="promo-success">✓ Promo code applied: {promoCode}</p>
                <button onClick={handlePromoRemove} className="remove-promo">Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
