import ProductRequest from '../models/solicitud.model.js';
import Offer from '../models/oferta.model.js';

export const createRequest = async (req, res) => {
  try {
    const { productName, quantity, details } = req.body;
    const pr = await ProductRequest.create({ client: req.user._id, productName, quantity, details });
    res.status(201).json(pr);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const listMyRequests = async (req, res) => {
  const list = await ProductRequest.find({ client: req.user._id }).sort('-createdAt');
  res.json(list);
};

export const listOpenRequests = async (_req, res) => {
  const list = await ProductRequest.find({ status: 'OPEN' }).sort('-createdAt');
  res.json(list);
};

export const closeRequestOnAccept = async (requestId, acceptedOfferId) => {
  await ProductRequest.findByIdAndUpdate(requestId, { status: 'CLOSED' });
  await Offer.updateMany({ request: requestId, _id: { $ne: acceptedOfferId } }, { $set: { status: 'REJECTED' } });
};
