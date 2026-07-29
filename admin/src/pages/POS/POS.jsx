import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './POS.css';
import { useAuth } from '../../context/AuthContext';

const POS = ({ url }) => {
  const { getUserName } = useAuth();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    country: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [staffName, setStaffName] = useState(getUserName() || 'Cashier');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants
  const deliveryFee = 5; // PHP
  const TAX_RATE = 0; // No tax by default, adjust as needed

  // Fetch categories and foods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, foodRes, tableRes] = await Promise.all([
          axios.get(url + "/api/category/cat-list"),
          axios.get(url + "/api/food/list"),
          axios.get(url + "/api/tables/list")
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (foodRes.data.success) {
          setFoods(foodRes.data.data);
          setFilteredFoods(foodRes.data.data);
        }
        if (tableRes.data.success) setTables(tableRes.data.data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  // Filter foods by category and search
  useEffect(() => {
    let filtered = foods;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredFoods(filtered);
  }, [selectedCategory, searchQuery, foods]);

  // Add item to cart
  const addToCart = (food) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === food._id);
      if (existing) {
        return prev.map(item =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (foodId) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === foodId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item._id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item._id !== foodId);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDeliveryAddress({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      province: "",
      zipCode: "",
      country: "",
      phone: ""
    });
    setSelectedTable(null);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const orderTotal = orderType === 'delivery' ? subtotal + deliveryFee : subtotal;

  // Handle delivery address field changes
  const onDeliveryAddressChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  // Handle payment
  const handlePayment = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        amount: orderTotal,
        paymentMethod: paymentMethod,
        orderType: orderType,
        tableNumber: selectedTable,
        staffName: staffName,
        customerName: customerName || 'Walk-in Customer',
        address: orderType === 'delivery' ? deliveryAddress : null
      };

      const res = await axios.post(url + "/api/pos/place", orderData);

      if (res.data.success) {
        setCompletedOrder(res.data.data);
        setShowPaymentModal(false);
        setCart([]);
        setCustomerName('');
        setDeliveryAddress({
          firstName: "",
          lastName: "",
          street: "",
          city: "",
          province: "",
          zipCode: "",
          country: "",
          phone: ""
        });
        setSelectedTable(null);
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  // Quick quantity buttons
  const quickAdd = (food, qty) => {
    for (let i = 0; i < qty; i++) {
      addToCart(food);
    }
  };

  // Handle table selection
  const selectTable = (tableNum) => {
    if (tableNum === selectedTable) {
      setSelectedTable(null);
    } else {
      setSelectedTable(tableNum);
    }
  };

  // Get occupied table numbers for display
  const occupiedTables = tables
    .filter(t => t.status === 'occupied')
    .map(t => t.tableNumber);

  const availableTables = tables
    .filter(t => t.status === 'available')
    .map(t => t.tableNumber);

  return (
    <div className='pos add'>

      <h1>POS</h1>

      <div className="pos-container">

        {/* Left Panel - Menu */}
        <div className="pos-menu-panel">

          <div className="flex-col">

            <div className="pos-staff-info">
              <span>👤 Staff: {staffName}</span>
            </div>

            <div className="pos-header ">
              <h2>🍽️ POS System</h2>
              <div className="pos-order-type-selector">
                <button
                  className={`pos-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  🪑 Dine-in
                </button>
                <button
                  className={`pos-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                  onClick={() => setOrderType('takeaway')}
                >
                  🥡 Takeaway
                </button>

                <button
                  className={`pos-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  🚚 Delivery
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="pos-search">
              <input
                type="text"
                placeholder="🔍 Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Buttons */}
            <div className="pos-categories">
              <button
                className={`pos-cat-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  className={`pos-cat-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="pos-food-grid">
              {loading ? (
                <div className="pos-loading">Loading menu...</div>
              ) : error ? (
                <div className="pos-error">{error}</div>
              ) : filteredFoods.length === 0 ? (
                <div className="pos-empty">No items found</div>
              ) : (
                filteredFoods.map(food => (
                  <div key={food._id} className="pos-food-card" onClick={() => addToCart(food)}>
                    <div className="pos-food-img-container">
                      <img
                        src={url + "/images/" + food.image}
                        alt={food.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food' }}
                      />
                      {food.stock <= 5 && food.stock > 0 && (
                        <span className="pos-low-stock">Low: {food.stock}</span>
                      )}
                      {food.stock === 0 && (
                        <span className="pos-out-of-stock">Out</span>
                      )}
                    </div>
                    <div className="pos-food-info">
                      <span className="pos-food-name">{food.name}</span>
                      <span className="pos-food-price">₱{food.price}</span>
                    </div>
                    <div className="pos-quick-qty">
                      <button onClick={(e) => { e.stopPropagation(); quickAdd(food, 1); }}>+1</button>
                      <button onClick={(e) => { e.stopPropagation(); quickAdd(food, 2); }}>+2</button>
                      <button onClick={(e) => { e.stopPropagation(); quickAdd(food, 3); }}>+3</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Order Ticket */}
        <div className="pos-order-panel">
          <div className="pos-order-header">
            <h3>🧾 Current Order</h3>
            <span className="pos-order-type-badge">{orderType}</span>
          </div>

          {/* Table Selection */}
          {orderType === 'dine-in' && (
            <div className="pos-table-select">
              <button
                className="pos-table-btn"
                onClick={() => setShowTableModal(true)}
              >
                {selectedTable ? `🪑 Table ${selectedTable}` : 'Select Table'}
              </button>
            </div>
          )}

          {/* Customer Name */}
          <div className="pos-customer-input">
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Delivery Address Fields */}
          {orderType === 'delivery' && (
            <div className="pos-delivery-address">
              <h4>Delivery Address</h4>
              <div className="pos-address-multi-fields">
                <input
                  name="firstName"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.firstName}
                  type="text"
                  placeholder="First Name"
                />
                <input
                  name="lastName"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.lastName}
                  type="text"
                  placeholder="Last Name"
                />
              </div>
              <input
                name="street"
                onChange={onDeliveryAddressChange}
                value={deliveryAddress.street}
                type="text"
                placeholder="Street"
              />
              <div className="pos-address-multi-fields">
                <input
                  name="city"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.city}
                  type="text"
                  placeholder="City / Municipality"
                />
                <input
                  name="province"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.province}
                  type="text"
                  placeholder="Province"
                />
              </div>
              <div className="pos-address-multi-fields">
                <input
                  name="zipCode"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.zipCode}
                  type="text"
                  placeholder="Zip Code"
                />
                <input
                  name="country"
                  onChange={onDeliveryAddressChange}
                  value={deliveryAddress.country}
                  type="text"
                  placeholder="Country"
                />
              </div>
              <input
                name="phone"
                onChange={onDeliveryAddressChange}
                value={deliveryAddress.phone}
                type="tel"
                placeholder="Phone"
              />
            </div>
          )}

          {/* Cart Items */}
          <div className="pos-cart-items">
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <p>Tap items on the left to add</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="pos-cart-item">
                  <div className="pos-cart-item-info">
                    <span className="pos-cart-item-name">{item.name}</span>
                    <span className="pos-cart-item-price">₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="pos-cart-item-controls">
                    <button onClick={() => removeFromCart(item._id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div className="pos-totals">
              <div className="pos-total-row">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="pos-total-row">
                  <span>Delivery Fee</span>
                  <span>₱{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="pos-total-row">
                  <span>Tax</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
              )}
              <div className="pos-total-row pos-grand-total">
                <span>Total</span>
                <span>₱{orderTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pos-actions">
            <button
              className="pos-btn-clear"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear
            </button>
            <button
              className="pos-btn-pay"
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
            >
              Charge ₱{orderTotal.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="pos-modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="pos-modal" onClick={e => e.stopPropagation()}>
              <button className="pos-modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
              <h2>Complete Payment</h2>

              <div className="pos-payment-summary">
                <div className="pos-payment-items">
                  {cart.map(item => (
                    <div key={item._id} className="pos-payment-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pos-payment-total">
                  <span>Total Amount</span>
                  <span className="pos-payment-amount">₱{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pos-payment-methods">
                <h3>Payment Method</h3>
                <div className="pos-payment-options">
                  <button
                    className={`pos-pay-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    💵 Cash
                  </button>
                  <button
                    className={`pos-pay-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Card
                  </button>
                  <button
                    className={`pos-pay-btn ${paymentMethod === 'gcash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('gcash')}
                  >
                    📱 GCash
                  </button>
                </div>
              </div>

              <button className="pos-confirm-payment" onClick={handlePayment}>
                Confirm Payment
              </button>
            </div>
          </div>
        )}

        {/* Table Selection Modal */}
        {showTableModal && (
          <div className="pos-modal-overlay" onClick={() => setShowTableModal(false)}>
            <div className="pos-table-modal" onClick={e => e.stopPropagation()}>
              <button className="pos-modal-close" onClick={() => setShowTableModal(false)}>×</button>
              <h2>Select Table</h2>

              <div className="pos-table-info-bar">
                <span className="pos-table-legend available">🟢 Available</span>
                <span className="pos-table-legend occupied">🔴 Occupied</span>
                <span className="pos-table-legend selected">🔵 Selected</span>
              </div>

              <div className="pos-table-grid">
                {tables.length === 0 ? (
                  <p>No tables created yet. Add tables from the Tables page.</p>
                ) : (
                  tables.map(table => (
                    <div
                      key={table._id}
                      className={`pos-table-item ${table.status === 'occupied' ? 'occupied' :
                        selectedTable === table.tableNumber ? 'selected' : 'available'
                        }`}
                      onClick={() => {
                        if (table.status !== 'occupied') {
                          selectTable(table.tableNumber);
                        }
                      }}
                    >
                      <span className="pos-table-number">T{table.tableNumber}</span>
                      <span className="pos-table-capacity">👤 {table.capacity}</span>
                      {table.status === 'occupied' && <span className="pos-table-occ-label">Occupied</span>}
                    </div>
                  ))
                )}
              </div>

              <button
                className="pos-confirm-table"
                onClick={() => setShowTableModal(false)}
              >
                {selectedTable ? `Table ${selectedTable} Selected` : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Receipt Modal after successful order */}
        {completedOrder && (
          <div className="pos-modal-overlay" onClick={() => setCompletedOrder(null)}>
            <div className="pos-modal pos-receipt-modal" onClick={e => e.stopPropagation()}>
              <button className="pos-modal-close" onClick={() => setCompletedOrder(null)}>×</button>
              <div className="pos-receipt">
                <h2>🧾 Order Complete</h2>
                <p className="pos-receipt-number">Receipt: {completedOrder.receiptNumber}</p>

                <div className="pos-receipt-details">
                  <p>Type: {completedOrder.order.orderType}</p>
                  {completedOrder.order.tableNumber && (
                    <p>Table: {completedOrder.order.tableNumber}</p>
                  )}
                  <p>Amount: ₱{completedOrder.order.amount.toFixed(2)}</p>
                  <p>Payment: {completedOrder.order.paymentMethod}</p>
                </div>

                <div className="pos-receipt-items">
                  {completedOrder.order.items.map((item, idx) => (
                    <div key={idx} className="pos-receipt-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="pos-btn-print"
                  onClick={() => window.print()}
                >
                  🖨️ Print Receipt
                </button>
                <button
                  className="pos-btn-new-order"
                  onClick={() => setCompletedOrder(null)}
                >
                  New Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;