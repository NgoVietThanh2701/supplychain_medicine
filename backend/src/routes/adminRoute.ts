import express from 'express';
import * as adminController from '../controllers/adminController';
import isAdmin from '../authentication/isAdmin';

const router = express.Router();

router.patch('/approve/:code', isAdmin, adminController.addUser);
router.get('/users', isAdmin, adminController.listUser);
router.get('/user/:code', isAdmin, adminController.singleUser);
router.get('/requests', isAdmin, adminController.requestUsers);
router.delete('/delete/:code', isAdmin, adminController.deleteRequest);
export default router;