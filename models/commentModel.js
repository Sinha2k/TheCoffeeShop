import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    writer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }, 
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [
        {
            type: mongoose.Schema.ObjectId, 
            ref: 'Users'
        }
    ],
    storyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Stories'
    },
    content: {
        type: String,
        required:true
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema);

export default Comment