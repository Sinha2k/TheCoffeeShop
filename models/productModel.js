import mongoose from "mongoose"


const productSchema = new mongoose.Schema({
    product_id:{
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
    price:{
        type: Number,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    ratings:{
        type: Number,
        default: 0
    },
    numOfReviews:{
        type: Number,
        default: 0
    },
    images:{
        type: String,
        required: true
    },
    size:{
        type: Array,
        default : ["Nhỏ"]
    },
    category:{
        type: String,
        required: true
    },
    reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "Users",
            required: true,
        },
        avatar:{
            type:String,
            required:true
        },
        name: {
            type: String,
            required: true,
        },
         rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
      },
    ],
    sold:{
        type: Number,
        default: 0
    },
    sale:{
        type : Number,
        default : 0
    },
    startSale:{
        type:String,
        default :''
    },
    endSale:{
        type:String,
        default:''
    },
    priceSale:{
        type:Number,
        default: 0
    }
}, {
    timestamps: true
})
productSchema.index({title:'text'})

mongoose.model("Products", productSchema).createIndexes({title:'text'})

export default mongoose.model("Products", productSchema)