import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tables.css';

const Tables = ({ url }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: 4, location: 'Main Hall' });
  const [bulkConfig, setBulkConfig] = useState({ count: 10, startNumber: 1, capacity: 4, location: 'Main Hall' });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url + "/api/tables/list");
      if (res.data.success) setTables(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, [url]);

  const handleAdd = async () => {
    try {
      const res = await axios.post(url + "/api/tables/add", newTable);
      if (res.data.success) {
        fetchTables();
        setShowAddModal(false);
        setNewTable({ tableNumber: '', capacity: 4, location: 'Main Hall' });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error adding table");
    }
  };

  const handleBulkCreate = async () => {
    try {
      const res = await axios.post(url + "/api/tables/bulk-create", bulkConfig);
      if (res.data.success) {
        fetchTables();
        setShowBulkModal(false);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error creating tables");
    }
  };

  const handleEdit = async () => {
    if (!editTable) return;
    try {
      const res = await axios.put(url + "/api/tables/" + editTable._id, {
        tableNumber: editTable.tableNumber,
        capacity: editTable.capacity,
        location: editTable.location
      });
      if (res.data.success) {
        fetchTables();
        setShowEditModal(false);
        setEditTable(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error updating table");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      const res = await axios.delete(url + "/api/tables/" + id);
      if (res.data.success) fetchTables();
    } catch (err) {
      alert("Error deleting table");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(url + "/api/tables/" + id + "/status", { status });
      fetchTables();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#4caf50';
      case 'occupied': return '#e94560';
      case 'reserved': return '#ff9800';
      case 'unavailable': return '#999';
      default: return '#999';
    }
  };

  return (
    <div className="tables add flex-col">

      <div className="tables-header">
        <h1>Table Management</h1>

        <div className="tables-actions">
          <button className="tables-btn tables-btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Table
          </button>
          <button className="tables-btn tables-btn-secondary" onClick={() => setShowBulkModal(true)}>
            Bulk Create
          </button>
        </div>

      </div>

      {/* Legend */}
      <div className="tables-legend">
        <span><span className="legend-dot" style={{background: '#4caf50'}}></span> Available</span>
        <span><span className="legend-dot" style={{background: '#e94560'}}></span> Occupied</span>
        <span><span className="legend-dot" style={{background: '#ff9800'}}></span> Reserved</span>
        <span><span className="legend-dot" style={{background: '#999'}}></span> Unavailable</span>
      </div>

      {/* Floor Plan Grid */}
      {loading ? (
        <div className="tables-loading">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="tables-empty">
          <p>No tables created yet. Click "Add Table" or "Bulk Create" to get started.</p>
        </div>
      ) : (
        <div className="tables-floor-plan">
          {tables.map(table => (
            <div
              key={table._id}
              className="table-card"
              style={{ borderColor: getStatusColor(table.status) }}
            >
              <div className="table-card-header" style={{ background: getStatusColor(table.status) }}>
                <span className="table-number">Table {table.tableNumber}</span>
                <span className="table-capacity">👤 {table.capacity}</span>
              </div>
              <div className="table-card-body">
                <p className="table-location">{table.location}</p>
                <p className="table-status" style={{ color: getStatusColor(table.status) }}>
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </p>
              </div>
              <div className="table-card-actions">
                <button 
                  className="table-action-btn edit"
                  onClick={() => { setEditTable(table); setShowEditModal(true); }}
                >
                  ✏️
                </button>
                <button 
                  className="table-action-btn status"
                  onClick={() => {
                    const newStatus = table.status === 'available' ? 'occupied' : 
                                     table.status === 'occupied' ? 'reserved' : 'available';
                    handleStatusChange(table._id, newStatus);
                  }}
                >
                  🔄
                </button>
                <button 
                  className="table-action-btn delete"
                  onClick={() => handleDelete(table._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="tables-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="tables-modal" onClick={e => e.stopPropagation()}>
            <h2>Add Table</h2>
            <div className="tables-form-group">
              <label>Table Number</label>
              <input 
                type="number" 
                value={newTable.tableNumber}
                onChange={e => setNewTable({...newTable, tableNumber: parseInt(e.target.value) || ''})}
                placeholder="e.g. 1"
              />
            </div>
            <div className="tables-form-group">
              <label>Capacity (seats)</label>
              <input 
                type="number" 
                value={newTable.capacity}
                onChange={e => setNewTable({...newTable, capacity: parseInt(e.target.value) || 4})}
              />
            </div>
            <div className="tables-form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={newTable.location}
                onChange={e => setNewTable({...newTable, location: e.target.value})}
                placeholder="e.g. Main Hall, Outdoor, VIP Room"
              />
            </div>
            <div className="tables-modal-actions">
              <button className="tables-btn tables-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="tables-btn tables-btn-primary" onClick={handleAdd}>Add Table</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Create Modal */}
      {showBulkModal && (
        <div className="tables-modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="tables-modal" onClick={e => e.stopPropagation()}>
            <h2>Bulk Create Tables</h2>
            <div className="tables-form-group">
              <label>Number of Tables</label>
              <input 
                type="number" 
                value={bulkConfig.count}
                onChange={e => setBulkConfig({...bulkConfig, count: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="tables-form-group">
              <label>Starting Number</label>
              <input 
                type="number" 
                value={bulkConfig.startNumber}
                onChange={e => setBulkConfig({...bulkConfig, startNumber: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="tables-form-group">
              <label>Capacity per Table</label>
              <input 
                type="number" 
                value={bulkConfig.capacity}
                onChange={e => setBulkConfig({...bulkConfig, capacity: parseInt(e.target.value) || 4})}
              />
            </div>
            <div className="tables-form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={bulkConfig.location}
                onChange={e => setBulkConfig({...bulkConfig, location: e.target.value})}
              />
            </div>
            <div className="tables-modal-actions">
              <button className="tables-btn tables-btn-cancel" onClick={() => setShowBulkModal(false)}>Cancel</button>
              <button className="tables-btn tables-btn-primary" onClick={handleBulkCreate}>
                Create {bulkConfig.count} Tables
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && editTable && (
        <div className="tables-modal-overlay" onClick={() => { setShowEditModal(false); setEditTable(null); }}>
          <div className="tables-modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Table {editTable.tableNumber}</h2>
            <div className="tables-form-group">
              <label>Table Number</label>
              <input 
                type="number" 
                value={editTable.tableNumber}
                onChange={e => setEditTable({...editTable, tableNumber: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="tables-form-group">
              <label>Capacity</label>
              <input 
                type="number" 
                value={editTable.capacity}
                onChange={e => setEditTable({...editTable, capacity: parseInt(e.target.value) || 4})}
              />
            </div>
            <div className="tables-form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={editTable.location}
                onChange={e => setEditTable({...editTable, location: e.target.value})}
              />
            </div>
            <div className="tables-modal-actions">
              <button className="tables-btn tables-btn-cancel" onClick={() => { setShowEditModal(false); setEditTable(null); }}>Cancel</button>
              <button className="tables-btn tables-btn-primary" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;