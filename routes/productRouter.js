import express from "express";
import productCtrl from "../controllers/productCtrl.js";
import auth from '../middleware/auth.js'
import authAdmin from '../middleware/authAdmin.js'
const router = express.Router()
router.route('/')
.get(productCtrl.getProducts)
.post(productCtrl.createProduct)
router.route('/allProducts').get(productCtrl.getAllProducts)
router.route('/:id')
.delete(productCtrl.deleteProduct)
.put(productCtrl.updateProduct)
router.post('/:id/createReview',auth,productCtrl.createReview)
router.get('/:id/getAllReview',auth,productCtrl.getAllReview)
router.delete('/:id/deleteReview',auth,authAdmin, productCtrl.deleteReview)
router.put('/:id/sale',auth,authAdmin, productCtrl.sale)

export default router