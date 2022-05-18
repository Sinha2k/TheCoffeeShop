import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        require : true,
        trim:true, 
        unique:true
    }
},{
    timestamps: true
})
export default mongoose.model('Category',categorySchema);