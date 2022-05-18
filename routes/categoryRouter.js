import express from "express";
import categoryCtrl from "../controllers/categoryCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
const router = express.Router();
router.get('/',categoryCtrl.getCategory)
router.post('/createCategory',auth,authAdmin,categoryCtrl.createCategory)
router.delete('/:id/deleteCategory',auth,authAdmin,categoryCtrl.deleteCategory)
router.put('/:id/updateCategory',auth,authAdmin,categoryCtrl.updateCategory)
export default router