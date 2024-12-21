import express, { Router } from 'express';
import * as authController from '../controllers/authController';
import { body } from 'express-validator';

const router: Router = express.Router();

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6 }), authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.get('/getMe', authController.getMe);
router.get('/get-info-user/:code', authController.getInfoUser);

export default router;