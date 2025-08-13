import Offer from '../models/oferta.model.js';
import ProductRequest from '../models/solicitud.model.js';
import { closeRequestOnAccept } from './solicitudes.controller.js';

export const createOffer = async (req, res) => {
  try {
    const { requestId, price } = req.body;
    const request = await ProductRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    if (request.status !== 'OPEN') return res.status(400).json({ message: 'Solicitud cerrada' });
    const offer = await Offer.create({ request: requestId, provider: req.user._id, price });
    res.status(201).json(offer);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const decideOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, price } = req.body;
    const offer = await Offer.findById(id).populate({ path: 'request', select: 'client status' });
    if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
    if (String(offer.request.client) !== String(req.user._id)) {
      return res.status(403).json({ message: 'No eres el dueño de la solicitud' });
    }
    if (offer.request.status !== 'OPEN') return res.status(400).json({ message: 'Solicitud cerrada' });
    if (action === 'ACCEPT') {
      offer.status = 'ACCEPTED';
      await offer.save();
      await closeRequestOnAccept(offer.request._id, offer._id);
      return res.json({ message: 'Oferta aceptada', offer });
    }
    if (action === 'REJECT') {
      offer.status = 'REJECTED';
      await offer.save();
      return res.json({ message: 'Oferta rechazada', offer });
    }
    if (action === 'COUNTER') {
      if (typeof price !== 'number' || price <= 0) return res.status(400).json({ message: 'Precio de contraoferta inválido' });
      offer.status = 'COUNTERED';
      offer.precioOfertaCliente = price;
      offer.history.push({ from: 'CLIENTE', price });
      await offer.save();
      return res.json({ message: 'Contraoferta del cliente enviada', offer });
    }
    return res.status(400).json({ message: 'Acción inválida' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const providerCounter = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const offer = await Offer.findById(id).populate({ path: 'request', select: 'status' });
    if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
    if (String(offer.provider) !== String(req.user._id)) return res.status(403).json({ message: 'No eres el dueño de la oferta' });
    if (offer.request.status !== 'OPEN') return res.status(400).json({ message: 'Solicitud cerrada' });
    if (typeof price !== 'number' || price <= 0) return res.status(400).json({ message: 'Precio inválido' });
    offer.contraOfertaProveedor = price;
    offer.status = 'PENDING';
    offer.history.push({ from: 'PROVEEDOR', price });
    await offer.save();
    res.json({ message: 'Contraoferta del proveedor enviada', offer });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const listOffersByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const offers = await Offer.find({ request: requestId }).populate('provider', 'name email').populate('request');
    res.json(offers.map(o => ({
      _id: o._id,
      request: o.request._id,
      provider: o.provider,
      price: o.price,
      precioOfertaCliente: o.precioOfertaCliente || null,
      contraOfertaProveedor: o.contraOfertaProveedor || null,
      status: o.status,
      history: o.history || []
    })));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const listAcceptedOffers = async (_req, res) => {
  try {
    const offers = await Offer.find({ status: 'ACCEPTED' }).populate('provider', 'name email').populate('request');
    res.json(offers.map(o => ({
      _id: o._id,
      request: o.request._id,
      productName: o.request.productName,
      quantity: o.request.quantity,
      provider: o.provider,
      price: o.price,
      precioOfertaCliente: o.precioOfertaCliente || null,
      contraOfertaProveedor: o.contraOfertaProveedor || null,
      status: o.status,
    })));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
