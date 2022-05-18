import express from 'express'
import auth from "../middleware/auth.js";
import messageCtrl from '../controllers/messageCtrl.js'
const router = express.Router()
router.route('/:id').get(auth,messageCtrl.allMessages)
router.route('/').post(auth,messageCtrl.sendMessage)
export default router