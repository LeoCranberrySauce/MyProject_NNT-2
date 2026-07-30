import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

const Reports = ({ url }) => {
  const [reportType, setReportType] = useState('daily');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url + "/api/order/list");
      if (res.data.success) {
        let allOrders = res.data.data;
        
        // Filter by date
        if (reportType === 'daily') {
          allOrders = allOrders.filter(o => 
            new Date(o.createdAt).toISOString().split('T')[0] === dateRange.from
          );
        } else if (reportType === 'range') {
          allOrders = allOrders.filter(o => {
            const d = new Date(o.createdAt).toISOString().split('T')[0];
            return d >= dateRange.from && d <= dateRange.to;
          });
        }
        
        setOrders(allOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const paidOrders = orders.filter(o => o.payment).length;
  const unpaidOrders = orders.filter(o => !o.payment).length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  // Orders by type
  const dineInOrders = orders.filter(o => o.orderType === 'dine-in').length;
  const takeawayOrders = orders.filter(o => o.orderType === 'takeaway').length;
  const deliveryOrders = orders.filter(o => o.orderType === 'delivery' || !o.orderType).length;

  // Payment methods
  const cashPayments = orders.filter(o => o.paymentMethod === 'cash').length;
  const cardPayments = orders.filter(o => o.paymentMethod === 'card').length;
  const gcashPayments = orders.filter(o => o.paymentMethod === 'gcash').length;
  const stripePayments = orders.filter(o => o.paymentMethod === 'stripe' || (o.payment && !o.paymentMethod)).length;

  // Aggregate items sold
  const itemSales = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        const key = item.name || item._id;
        if (!itemSales[key]) itemSales[key] = { name: key, qty: 0, revenue: 0 };
        itemSales[key].qty += item.quantity || 1;
        itemSales[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    }
  });
  const topItems = Object.values(itemSales).sort((a, b) => b.qty - a.qty).slice(0, 10);

  const formatCurrency = (v) => `₱${parseFloat(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const exportCSV = () => {
    const rows = [['Order ID', 'Type', 'Amount', 'Payment', 'Status', 'Date']];
    orders.forEach(o => {
      rows.push([
        o._id,
        o.orderType || 'delivery',
        o.amount,
        o.paymentMethod || (o.payment ? 'stripe' : 'unpaid'),
        o.status,
        new Date(o.createdAt).toLocaleString()
      ]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `report-${dateRange.from}.csv`;
    a.click();
  };

  return (
    <div className="reports add flex-col">
      
      <div className="reports-header">
        <h1>Sales Reports</h1>
        <button className="reports-btn-export" onClick={exportCSV}>Export CSV</button>
      </div>

      {/* Controls */}
      <div className="reports-controls">
        <div className="reports-type-select">
          <button className={`reports-type-btn ${reportType === 'daily' ? 'active' : ''}`} onClick={() => setReportType('daily')}>Daily</button>
          <button className={`reports-type-btn ${reportType === 'weekly' ? 'active' : ''}`} onClick={() => setReportType('weekly')}>Weekly</button>
          <button className={`reports-type-btn ${reportType === 'monthly' ? 'active' : ''}`} onClick={() => setReportType('monthly')}>Monthly</button>
          <button className={`reports-type-btn ${reportType === 'range' ? 'active' : ''}`} onClick={() => setReportType('range')}>Custom Range</button>
        </div>
        <div className="reports-date-inputs">
          <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} />
          {(reportType === 'range' || reportType === 'daily') && (
            <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} />
          )}
          <button className="reports-btn-refresh" onClick={fetchReportData}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="reports-loading">Loading...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="reports-kpi-grid">
            <div className="reports-kpi-card">
              <h3>Total Orders</h3>
              <p className="kpi-value">{totalOrders}</p>
            </div>
            <div className="reports-kpi-card">
              <h3>Total Revenue</h3>
              <p className="kpi-value">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="reports-kpi-card">
              <h3>Paid</h3>
              <p className="kpi-value">{paidOrders}</p>
            </div>
            <div className="reports-kpi-card">
              <h3>Unpaid</h3>
              <p className="kpi-value">{unpaidOrders}</p>
            </div>
            <div className="reports-kpi-card">
              <h3>Completed</h3>
              <p className="kpi-value">{deliveredOrders}</p>
            </div>
            <div className="reports-kpi-card">
              <h3>Cancelled</h3>
              <p className="kpi-value">{cancelledOrders}</p>
            </div>
          </div>

          {/* Order Type Breakdown */}
          <div className="reports-section">
            <h2>Orders by Type</h2>
            <div className="reports-breakdown">
              <div className="reports-breakdown-item">
                <span>Dine-in</span>
                <span className="breakdown-value">{dineInOrders}</span>
              </div>
              <div className="reports-breakdown-item">
                <span>Takeaway</span>
                <span className="breakdown-value">{takeawayOrders}</span>
              </div>
              <div className="reports-breakdown-item">
                <span>Delivery</span>
                <span className="breakdown-value">{deliveryOrders}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="reports-section">
            <h2>Payment Methods</h2>
            <div className="reports-breakdown">
              <div className="reports-breakdown-item">
                <span>💵 Cash</span>
                <span className="breakdown-value">{cashPayments}</span>
              </div>
              <div className="reports-breakdown-item">
                <span>💳 Card</span>
                <span className="breakdown-value">{cardPayments}</span>
              </div>
              <div className="reports-breakdown-item">
                <span>📱 GCash</span>
                <span className="breakdown-value">{gcashPayments}</span>
              </div>
              <div className="reports-breakdown-item">
                <span>🌐 Online (Stripe)</span>
                <span className="breakdown-value">{stripePayments}</span>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="reports-section">
            <h2>Top Selling Items</h2>
            {topItems.length === 0 ? (
              <p className="reports-no-data">No sales data</p>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Qty Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Orders */}
          <div className="reports-section">
            <h2>Recent Orders ({totalOrders})</h2>
            {orders.length === 0 ? (
              <p className="reports-no-data">No orders found</p>
            ) : (
              <div className="reports-orders-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Receipt</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 50).map(order => (
                      <tr key={order._id}>
                        <td>{order.receiptNumber || 'N/A'}</td>
                        <td>{order.orderType || 'delivery'}</td>
                        <td>{formatCurrency(order.amount)}</td>
                        <td>{order.paymentMethod || (order.payment ? 'stripe' : 'unpaid')}</td>
                        <td><span className={`status-badge status-${order.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>{order.status}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;