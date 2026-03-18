import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, getSubtotalWithDiscount, url, token, promoCode, applyPromoCode, removePromoCode, promoDiscount, getFinalAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState({ type: '', text: '' });
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    if (!token) {
      setPromoMessage({ type: 'error', text: 'Please login to apply promo codes' });
      return;
    }
    
    setIsApplying(true);
    setPromoMessage({ type: '', text: '' });
    
    const result = await applyPromoCode(promoInput);
    
    if (result.success) {
      setPromoMessage({ type: 'success', text: result.message });
    } else {
      setPromoMessage({ type: 'error', text: result.message });
    }
    setIsApplying(false);
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInput('');
    setPromoMessage({ type: '', text: '' });
  };

  const handleCheckout = () => {
    if (!token) {
      // Show login popup
      const event = new CustomEvent('showLoginPopup');
      window.dispatchEvent(event);
    } else {
      navigate('/order');
    }
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
            {promoDiscount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p style={{color: 'green'}}>Discount</p>
                  <p style={{color: 'green'}}>-{formatCurrency3(promoDiscount)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{formatCurrency3(getTotalCartAmount() === 0 ? 0 : 5)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{formatCurrency3(getFinalAmount())}</b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here to get discounts and perks!</p>
            {promoCode ? (
              <div className="promo-applied">
                <span style={{color: 'green', fontWeight: 'bold'}}>{promoCode.code} applied!</span>
                <button onClick={handleRemovePromo} className="remove-promo-btn">Remove</button>
              </div>
            ) : (
              <div className="cart-promocode-input">
                <input 
                  type="text" 
                  placeholder='Enter the promo code' 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button onClick={handleApplyPromo} disabled={isApplying}>
                  {isApplying ? 'Applying...' : 'Submit'}
                </button>
              </div>
            )}
            {promoMessage.text && (
              <p className={`promo-message ${promoMessage.type}`}>
                {promoMessage.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
