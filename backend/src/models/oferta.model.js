import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  from: { type: String, enum: ['CLIENTE', 'PROVEEDOR'], required: true },
  price: { type: Number, required: true },
  at: { type: Date, default: Date.now }
}, { _id: false });

const OfferSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductRequest', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  precioOfertaCliente: { type: Number },
  contraOfertaProveedor: { type: Number },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED'], default: 'PENDING' },
  history: [CounterSchema]
}, { timestamps: true });

export default mongoose.model('Offer', OfferSchema);
