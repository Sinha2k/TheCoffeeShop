import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    story_id:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    content : {
        type: String,
        trim:true,
        required:true
    },
    category : {
        type: String,
        trim:true,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    likeCount:{
        type:Number,
        default:0
    },
    like :[
        {
            type: mongoose.Schema.ObjectId, 
            ref: "Users"
        }
    ],
    comments:[
        {
            type: mongoose.Schema.ObjectId, 
            ref: "Comment"
        }
    ]
},{
    timestamps:true
})
storySchema.index({category:'text'})
mongoose.model("Stories", storySchema).createIndexes({category:'text'})
export default mongoose.model("Stories",storySchema)
