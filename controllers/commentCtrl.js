import Comments from '../models/commentModel.js'
import Stories from '../models/storyModel.js'
import User from '../models/userModel.js'
const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { storyId, content, tag, reply } = req.body

            const story = await Stories.findById(storyId)
            if(!story) return res.status(400).json({msg: "This story does not exist."})

            if(reply){
                const cm = await Comments.findById(reply)
                if(!cm) return res.status(400).json({msg: "This comment does not exist."})
            }

            const newComment = new Comments({
                writer: req.user.id, content, tag, reply, storyId
            })

            await Stories.findOneAndUpdate({_id: storyId}, {
                $push: {comments: newComment._id}
            }, {new: true})

            await newComment.save()
            var comment = await Comments.findById(newComment._id).populate("writer","-password")
            comment = await User.populate(comment,{
                path:"comment.writer",
                select:"name avatar"
            })
            res.json({comment})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body
            
            await Comments.findOneAndUpdate({
                _id: req.params.id, writer: req.user.id
            }, {content})

            res.json({msg: 'Update Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comments.findById(req.params.id)
            if(comment.likes.includes(req.user.id)) return res.status(400).json({msg: "You liked this comment."})
  
            comment.likes.push(req.user.id)
            await comment.save()

            res.json({msg: 'Liked Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikeComment: async (req, res) => {
        try {
            const comment = await Comments.findById(req.params.id)
            if(!comment.likes.includes(req.user.id)) return res.status(400).json({msg: "You didn't like this comment."})
  
            comment.likes.splice(comment.likes.indexOf(req.user.id),1)
            await comment.save()

            res.json({msg: 'UnLiked Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {writer: req.user.id},
                ]
            })

            await Stories.findOneAndUpdate({_id: comment.storyId}, {
                $pull: {comments: req.params.id}
            })

            res.json({msg: 'Deleted Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

export default commentCtrl