import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    paymentID:{
        type: String,
        default:''
    },
    address:{
        type: Object,
        required: true
    },
    cart:{
        type: Array,
        default: []
    },
    status:{
        type: Number,
        default: 0
    },
    method:{
        type:Number,
        default:0
    },
    phoneNumber:{
        type:String,
        default:''
    },
    fullName:{
        type:String,
        default:''
    }
}, {
    timestamps: true
})

export default mongoose.model('Payments',paymentSchema);