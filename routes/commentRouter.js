import express from "express";
import commentCtrl from "../controllers/commentCtrl.js";
import auth from '../middleware/auth.js'
const router = express.Router()

router.post('/', auth, commentCtrl.createComment)

router.patch('/:id', auth, commentCtrl.updateComment)

router.get('/:id/like', auth, commentCtrl.likeComment)

router.get('/:id/unlike', auth, commentCtrl.unLikeComment)

router.delete('/:id', auth, commentCtrl.deleteComment)

export default router