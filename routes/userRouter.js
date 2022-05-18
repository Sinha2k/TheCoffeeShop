import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import paymentCtrl from "../controllers/paymentCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from '../middleware/authAdmin.js'
const router = express.Router();
router.post('/register',userCtrl.register);
router.post('/login',userCtrl.login);
router.get('/logout',userCtrl.logout);
router.get('/refresh_token',userCtrl.refreshToken);
router.get('/info',auth,userCtrl.getUser);
router.put('/updateProfile',auth,userCtrl.updateUserProfile);
router.put('/changePassword',auth,userCtrl.changePassword)
router.patch('/addCart',auth,userCtrl.addCart)
router.get('/history',auth,userCtrl.history)
router.get('/allHistory',auth,authAdmin, userCtrl.allHistory)
router.put('/history/:id',auth,authAdmin,paymentCtrl.updatePayment)
router.patch('/updateStoriesList',auth,userCtrl.updateStoriesList)
router.patch('/updatelastLogin',auth,userCtrl.updatelastLogin)
router.get('/getAllUser',auth,authAdmin,userCtrl.getAllUser)
router.patch('/:id/changeRole',auth,authAdmin,userCtrl.changeRole)
router.patch('/:id/updateStatus',auth,userCtrl.updateStatus)
export default router;