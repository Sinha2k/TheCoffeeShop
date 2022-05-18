import express from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import paymentCtrl from '../controllers/paymentCtrl.js'
const router = express.Router()

router.route('/')
   .get(auth,authAdmin,paymentCtrl.getPayments)
   .post(auth,paymentCtrl.createPayment)

export default router