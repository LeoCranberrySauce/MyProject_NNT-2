import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Receipt.css';

const Receipt = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url + "/api/order/list");
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [url]);

  const filteredOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.receiptNumber && o.receiptNumber.toLowerCase().includes(q)) ||
      (o._id && o._id.toLowerCase().includes(q)) ||
      (o.address?.address && o.address.address.toLowerCase().includes(q)) ||
      (o.address?.name && o.address.name.toLowerCase().includes(q)) ||
      (o.address?.firstName && o.address.firstName.toLowerCase().includes(q))
    );
  });

  const formatCurrency = (v) => `₱${parseFloat(v || 0).toFixed(2)}`;

  const getCustomerName = (addr) => {
    if (!addr) return 'Walk-in';
    // Check for stored name field
    if (addr.name && addr.name !== 'undefined') return addr.name;
    // Check for firstName + lastName (Stripe orders)
    if (addr.firstName && addr.firstName !== 'undefined') {
      return (addr.firstName + ' ' + (addr.lastName || '')).trim();
    }
    // Check for generic address field
    if (addr.address && addr.address !== 'undefined') return addr.address;
    return 'Walk-in';
  };

  const getFullAddress = (addr) => {
    if (!addr || !addr.street) return null;
    const parts = [addr.street];
    if (addr.city) parts.push(addr.city);
    if (addr.province) parts.push(addr.province);
    if (addr.zipCode) parts.push(addr.zipCode);
    return parts.join(', ');
  };

  return (
    <div className="receipt add flex-col">

      <div className="receipt-header">
        <h1>Receipts</h1>
        <div className="receipt-search">
          <input
            type="text"
            placeholder="Search by receipt number or customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="receipt-loading">Loading...</div>
      ) : (
        <div className="receipt-content">
          <div className="receipt-order-list">
            <h2>Orders</h2>
            {filteredOrders.length === 0 ? (
              <p className="receipt-no-orders">No orders found</p>
            ) : (
              filteredOrders.slice(0, 50).map(order => (
                <div
                  key={order._id}
                  className={`receipt-order-card ${selectedOrder?._id === order._id ? 'active' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="receipt-order-info">
                    <span className="receipt-order-receipt">{order.receiptNumber || 'N/A'}</span>
                    <span className="receipt-order-type">{order.orderType || 'delivery'}</span>
                  </div>
                  <div className="receipt-order-amount">{formatCurrency(order.amount)}</div>
                  <div className="receipt-order-status">{order.status}</div>
                </div>
              ))
            )}
          </div>

          <div className="receipt-preview">
            {selectedOrder ? (
              <div className="receipt-paper" id="receipt-print">
                <div className="receipt-header-print">
                  <h2>🍽️ Restaurant Name</h2>
                  <p className="receipt-subtitle">POS Receipt</p>
                </div>
                <div className="receipt-divider">━━━━━━━━━━━━━━━━━━━━</div>
                <div className="receipt-meta">
                  <p><strong>Receipt:</strong> {selectedOrder.receiptNumber || selectedOrder._id}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Type:</strong> {selectedOrder.orderType || 'Delivery'}</p>
                  {selectedOrder.tableNumber && <p><strong>Table:</strong> {selectedOrder.tableNumber}</p>}
                  <p><strong>Customer:</strong> {getCustomerName(selectedOrder.address)}</p>
                  <p><strong>Staff:</strong> {selectedOrder.staffName || 'N/A'}</p>
                  {getFullAddress(selectedOrder.address) && (
                    <p><strong>Address:</strong> {getFullAddress(selectedOrder.address)}</p>
                  )}
                  {selectedOrder.address?.phone && <p><strong>Phone:</strong> {selectedOrder.address.phone}</p>}
                </div>
                <div className="receipt-divider">━━━━━━━━━━━━━━━━━━━━</div>
                <div className="receipt-items">
                  <div className="receipt-items-header">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Price</span>
                  </div>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="receipt-item-row">
                      <span className="receipt-item-name">{item.name}</span>
                      <span className="receipt-item-qty">x{item.quantity || 1}</span>
                      <span className="receipt-item-price">{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
                <div className="receipt-divider">━━━━━━━━━━━━━━━━━━━━</div>
                <div className="receipt-total">
                  <span>Total</span>
                  <span className="receipt-total-amount">{formatCurrency(selectedOrder.amount)}</span>
                </div>
                <div className="receipt-payment-info">
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod || (selectedOrder.payment ? 'stripe' : 'unpaid')}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                </div>
                <div className="receipt-divider">━━━━━━━━━━━━━━━━━━━━</div>
                <p className="receipt-thankyou">Thank you for your order!</p>
              </div>
            ) : (
              <div className="receipt-select-prompt">
                <p>Select an order to view receipt</p>
              </div>
            )}

            {selectedOrder && (
              <button className="receipt-btn-print" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;