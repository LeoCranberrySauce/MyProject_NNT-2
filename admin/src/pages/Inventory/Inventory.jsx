import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';

const Inventory = ({ url }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [filterStock, setFilterStock] = useState('all'); // all, low, out

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url + "/api/food/list");
      if (res.data.success) setFoods(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); }, [url]);

  const handleStockUpdate = async () => {
    if (!editModal) return;
    try {
      const res = await axios.put(url + "/api/food/update-stock", {
        foodId: editModal._id,
        stock: editModal.stock
      });
      if (res.data.success) {
        fetchFoods();
        setEditModal(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error updating stock");
    }
  };

  const handleRestock = async (foodId, amount) => {
    try {
      const food = foods.find(f => f._id === foodId);
      if (!food) return;
      const res = await axios.put(url + "/api/food/update-stock", {
        foodId,
        stock: (food.stock || 0) + amount
      });
      if (res.data.success) fetchFoods();
    } catch (err) {
      alert("Error restocking");
    }
  };

  // Filter logic
  let filtered = foods;
  if (searchQuery.trim()) {
    filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (filterStock === 'low') {
    filtered = filtered.filter(f => f.stock > 0 && f.stock <= 10);
  } else if (filterStock === 'out') {
    filtered = filtered.filter(f => f.stock === 0);
  }

  const lowStockItems = foods.filter(f => f.stock > 0 && f.stock <= 10);
  const outOfStockItems = foods.filter(f => f.stock === 0);

  return (
    <div className="inventory add flex-col">

      <div className="inventory-header">
        <h1>Inventory Management</h1>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="inventory-alerts">
          {outOfStockItems.length > 0 && (
            <div className="inventory-alert danger">
              ⚠️ {outOfStockItems.length} item(s) out of stock!
            </div>
          )}
          {lowStockItems.length > 0 && (
            <div className="inventory-alert warning">
              ⚠️ {lowStockItems.length} item(s) low on stock (≤ 10)
            </div>
          )}
        </div>
      )}

      {/* KPI Summary */}
      <div className="inventory-kpi-row">
        <div className="inv-kpi">
          <span className="inv-kpi-label">Total Items</span>
          <span className="inv-kpi-value">{foods.length}</span>
        </div>
        <div className="inv-kpi">
          <span className="inv-kpi-label">In Stock</span>
          <span className="inv-kpi-value">{foods.filter(f => f.stock > 0).length}</span>
        </div>
        <div className="inv-kpi">
          <span className="inv-kpi-label">Low Stock</span>
          <span className="inv-kpi-value warning">{lowStockItems.length}</span>
        </div>
        <div className="inv-kpi">
          <span className="inv-kpi-label">Out of Stock</span>
          <span className="inv-kpi-value danger">{outOfStockItems.length}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="inventory-controls">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select value={filterStock} onChange={e => setFilterStock(e.target.value)}>
          <option value="all">All Items</option>
          <option value="low">Low Stock (≤ 10)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="inventory-loading">Loading...</div>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Quick Restock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(food => (
                <tr key={food._id} className={food.stock === 0 ? 'row-out' : food.stock <= 10 ? 'row-low' : ''}>
                  <td>
                    <div className="inv-item-cell">
                      <img src={url + "/images/" + food.image} alt={food.name} className="inv-thumb" />
                      <span>{food.name}</span>
                    </div>
                  </td>
                  <td>{food.category}</td>
                  <td>₱{food.price}</td>
                  <td>
                    <span className={`stock-value ${food.stock === 0 ? 'danger-text' : food.stock <= 10 ? 'warning-text' : ''}`}>
                      {food.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`stock-badge ${food.stock === 0 ? 'badge-out' : food.stock <= 10 ? 'badge-low' : 'badge-ok'}`}>
                      {food.stock === 0 ? 'Out' : food.stock <= 10 ? 'Low' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="inv-restock-btns">
                      <button onClick={() => handleRestock(food._id, 10)}>+10</button>
                      <button onClick={() => handleRestock(food._id, 25)}>+25</button>
                      <button onClick={() => handleRestock(food._id, 50)}>+50</button>
                    </div>
                  </td>
                  <td>
                    <button className="inv-edit-btn" onClick={() => setEditModal({...food})}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Stock Modal */}
      {editModal && (
        <div className="inv-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Stock: {editModal.name}</h2>
            <div className="inv-modal-form">
              <label>Current Stock: <strong>{editModal.stock}</strong></label>
              <input
                type="number"
                value={editModal.stock}
                onChange={e => setEditModal({...editModal, stock: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="inv-modal-actions">
              <button className="inv-btn-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="inv-btn-save" onClick={handleStockUpdate}>Update Stock</button>
            </div>
          </div>
        </div>
      )}

      {/* Out-of-stock items need to be displayed */}
      {filtered.length === 0 && !loading && (
        <div className="inventory-empty">No items match your filter.</div>
      )}
    </div>
  );
};

export default Inventory;