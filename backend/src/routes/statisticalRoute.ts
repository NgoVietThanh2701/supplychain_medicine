import express from 'express';
import * as statisticalController from '../controllers/statisticalController';

const router = express.Router();
router.post('/create', statisticalController.createStatistical);
router.get('/get', statisticalController.getAllByUser);

export default router;