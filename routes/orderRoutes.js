import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getOrders, placeOrder, verifyOrder, listOrders, updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.get('/userorders', authMiddleware, getOrders);
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateStatus);

export default orderRouter;

//4242 4242 4242 4242