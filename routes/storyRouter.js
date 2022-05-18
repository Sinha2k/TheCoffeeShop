import express from "express";
import storyCtrl from "../controllers/storyCtrl.js";
import auth from "../middleware/auth.js";
const router = express.Router()
router.route('/')
.post(storyCtrl.createStory)

router.route('/:id')
.delete(storyCtrl.deleteStory)
.put(storyCtrl.updateStory)

router.get('/all',storyCtrl.getAllStories)
router.get('/:id/like',auth,storyCtrl.likeStory)
router.get('/:id/disLike',auth,storyCtrl.disLikeStory)
router.get('/:id/getLikeList',storyCtrl.getLikeList)
export default router