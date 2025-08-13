import mongoose from 'mongoose';

const ProductRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  details: { type: String },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model('ProductRequest', ProductRequestSchema);
