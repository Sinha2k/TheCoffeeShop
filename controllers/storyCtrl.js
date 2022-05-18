import storyModel from "../models/storyModel.js";
import User from '../models/userModel.js'
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
 
        const excludedFields = ['page', 'sort', 'limit','search']
        excludedFields.forEach(el => delete(queryObj[el]))
        
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
 
     //    gte = greater than or equal
     //    lte = lesser than or equal
     //    lt = lesser than
     //    gt = greater than
        this.query.find(JSON.parse(queryStr))
          
        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    searching(){
        const search = this.queryString.search
        if(search){
            this.query=this.query.find({
                $text : {$search : search}
            })
        }else{
            this.query = this.query.find()
        }
        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
const storyCtrl = {
    getAllStories: async(req, res) =>{
        try {

            const features = new APIfeatures(storyModel.find().populate({
                path:"comments",
                populate:{
                    path:"writer likes",
                    select:"-password"
                }
            }), req.query)
            .sorting()

            const stories = await features.query

            res.json({
                status: 'success',
                result: stories.length,
                stories: stories
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createStory: async(req, res) =>{
        try {
            const {story_id,title,content,image,description, category} = req.body;
            if(!image) return res.status(400).json({msg: "No image upload"})

            const story = await storyModel.findOne({story_id})
            if(story)
                return res.status(400).json({msg: "This story already exists."})

            const newStory = new storyModel({
                story_id, title, content, image, description, category
            })

            await newStory.save({ validateBeforeSave: false })
            res.json({newStory})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteStory: async(req, res) =>{
        try {
            await storyModel.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Story"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateStory: async(req, res) =>{
        try {
            const {title, content, image, description, category} = req.body;
            if(!image) return res.status(400).json({msg: "No image upload"})

            await storyModel.findOneAndUpdate({_id: req.params.id}, {
                title, content, image, description, category
            })

            res.json({msg: "Updated a Story"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likeStory: async(req,res)=>{
        try {
            const story = await storyModel.findById(req.params.id)
            const likeList = story.like
            if(likeList.includes(req.user.id)) return res.status(400).json("Favorite Before")
            likeList.push(req.user.id)
            story.likeCount = likeList.length
            await story.save()
            res.status(200).json({story})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    disLikeStory: async(req,res)=>{
        try {
            const story = await storyModel.findById(req.params.id)
            const likeList = story.like
            if(!likeList.includes(req.user.id)) return res.status(400).json("Not yet Favorite")
            likeList.splice(likeList.indexOf(req.user.id),1)
            story.likeCount = likeList.length
            await story.save()
            res.status(200).json({story})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getLikeList: async(req,res)=>{
        try {
            var story = await storyModel.findById(req.params.id).populate("like","-password")
            story = await User.populate(story,{
                path:"like.user",
                select:"name avatar email"
            })
            res.status(200).json({story})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

export default storyCtrl