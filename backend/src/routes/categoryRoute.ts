import express from 'express';
import * as categoryController from '../controllers/categoryController';
import isFactory from '../authentication/isFactory';

const router = express.Router();
router.post('/create', isFactory, categoryController.createCategory);
router.get('/get', isFactory, categoryController.getCategories);
router.patch('/update/:code', isFactory, categoryController.updateCategory);
router.delete('/delete/:code', isFactory, categoryController.deleteCategory);

export default router;