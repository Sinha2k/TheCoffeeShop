import express from 'express'
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import chatCtrl from '../controllers/chatCtrl.js'
const router = express.Router()
router.route('/')
.get(auth,chatCtrl.fetchChats)
.post(auth,chatCtrl.accessChat)
.post(auth,authAdmin,chatCtrl.createGroupChat)
export default router