import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createRequest, listMyRequests, listOpenRequests } from '../controllers/solicitudes.controller.js';
const router = Router();
router.post('/', authenticate, authorize('CLIENTE'), createRequest);
router.get('/mine', authenticate, authorize('CLIENTE'), listMyRequests);
router.get('/open', authenticate, authorize('PROVEEDOR'), listOpenRequests);
export default router;
