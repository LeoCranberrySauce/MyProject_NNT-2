import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, default: 4 },
    status: { type: String, enum: ['available', 'occupied', 'reserved', 'unavailable'], default: 'available' },
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', default: null },
    location: { type: String, default: 'Main Hall' },
    qrCode: { type: String, default: null }
});

const tableModel = mongoose.models.table || mongoose.model("table", tableSchema);

export default tableModel;