import express from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // used only to parse, we handle in upload route for files

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.none(), createProduct);
router.put('/:id', protect, adminOnly, upload.none(), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
