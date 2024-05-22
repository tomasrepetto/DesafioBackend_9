import { Router } from 'express';
import { addProduct, deleteProductsById, getProducts, getProductsById, modificarProducts } from '../dao/productsDB.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);
router.post('/', addProduct);
router.put('/:pid', modificarProducts);
router.delete('/:pid', deleteProductsById);

export default router;