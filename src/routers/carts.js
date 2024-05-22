import { Router } from 'express';
import { addProductInCart, createCart, deleteCart, deleteProductsInCart, getCartsById, updateCart, updateProductsInCart } from '../dao/cartsDB.js';


const router = Router();

router.get('/:cid', getCartsById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductInCart);
router.delete('/:cid/products/:pid', deleteProductsInCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductsInCart);
router.delete('/:cid', deleteCart);

export default router;