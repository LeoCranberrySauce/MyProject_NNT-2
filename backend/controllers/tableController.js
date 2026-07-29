import tableModel from "../models/tableModel.js";

// Get all tables
const getAllTables = async (req, res) => {
    try {
        const tables = await tableModel.find({}).sort({ tableNumber: 1 });
        res.json({ success: true, data: tables });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching tables" });
    }
};

// Get single table
const getTableById = async (req, res) => {
    try {
        const table = await tableModel.findById(req.params.id);
        if (!table) return res.json({ success: false, message: "Table not found" });
        res.json({ success: true, data: table });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching table" });
    }
};

// Add new table
const addTable = async (req, res) => {
    try {
        const { tableNumber, capacity, location } = req.body;
        const existing = await tableModel.findOne({ tableNumber });
        if (existing) return res.json({ success: false, message: "Table number already exists" });
        
        const newTable = new tableModel({ tableNumber, capacity, location });
        await newTable.save();
        res.json({ success: true, message: "Table added successfully", data: newTable });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding table" });
    }
};

// Update table
const updateTable = async (req, res) => {
    try {
        const { tableNumber, capacity, status, location } = req.body;
        const updateData = {};
        if (tableNumber !== undefined) updateData.tableNumber = tableNumber;
        if (capacity !== undefined) updateData.capacity = capacity;
        if (status !== undefined) updateData.status = status;
        if (location !== undefined) updateData.location = location;

        const table = await tableModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!table) return res.json({ success: false, message: "Table not found" });
        res.json({ success: true, message: "Table updated", data: table });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating table" });
    }
};

// Delete table
const deleteTable = async (req, res) => {
    try {
        const table = await tableModel.findByIdAndDelete(req.params.id);
        if (!table) return res.json({ success: false, message: "Table not found" });
        res.json({ success: true, message: "Table deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting table" });
    }
};

// Update table status
const updateTableStatus = async (req, res) => {
    try {
        const { status, currentOrderId } = req.body;
        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (currentOrderId !== undefined) updateData.currentOrderId = currentOrderId;

        const table = await tableModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!table) return res.json({ success: false, message: "Table not found" });
        res.json({ success: true, message: "Table status updated", data: table });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating table status" });
    }
};

// Bulk create tables (for quick setup)
const bulkCreateTables = async (req, res) => {
    try {
        const { count, startNumber, capacity, location } = req.body;
        const start = startNumber || 1;
        const tablesToCreate = [];
        
        for (let i = 0; i < count; i++) {
            tablesToCreate.push({
                tableNumber: start + i,
                capacity: capacity || 4,
                location: location || 'Main Hall'
            });
        }
        
        const created = await tableModel.insertMany(tablesToCreate);
        res.json({ success: true, message: `${created.length} tables created`, data: created });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating tables" });
    }
};

export { getAllTables, getTableById, addTable, updateTable, deleteTable, updateTableStatus, bulkCreateTables };