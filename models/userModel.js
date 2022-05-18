import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    avatar:{
        type : String,
        default: 'https://firebasestorage.googleapis.com/v0/b/the-coffee-shop-ab9d0.appspot.com/o/avt.jpg?alt=media&token=ddce86b8-d785-4224-a7b4-54e6057bc602'
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        trim : true
    },
    role : {
        type : Number,
        default : 0
    },
    status:{
        type : Boolean,
        default : false
    },
    lastLogin:{
        type:String,
        default:'number'
    },
    productsList : {
        type : Array,
        default : []
    },
    storiesList :{
        type : Array,
        default:[]
    },
    cart : {
        type : Array,
        default : []
    }
},{
    timestamps : true
})

export default mongoose.model('Users',userSchema);