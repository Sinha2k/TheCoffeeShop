import Products from "../models/productModel.js";

// Filter, sorting and paginating

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
            this.query = this.query.sort('-updatedAt')
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
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl = {
    getProducts: async(req, res) =>{
        try {
            const features = new APIfeatures(Products.find(), req.query)
            .filtering().sorting().searching()

            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllProducts: async(req, res) =>{
        try {
            const products = await Products.find()
            res.json({products})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async(req, res) =>{
        try {
            const {product_id, title, price, description, content, images, category, size} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            const product = await Products.findOne({product_id})
            if(product)
                return res.status(400).json({msg: "This product already exists."})

            const newProduct = new Products({
                product_id, title, price, description, content, images, category, size
            })

            await newProduct.save()
            res.json({newProduct})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async(req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req, res) =>{
        try {
            const {title, price, description, content, images, category, size} = req.body;

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title, price, description, content, images, category, size
            })

            res.json({msg:"Update a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createReview: async(req,res)=>{
        try {
            const {rating,comment,name,avatar} = req.body
            
            const review = {
                user: req.user.id,
                name: name,
                avatar: avatar,
                rating:Number(rating),
                comment:comment
            }
            const product = await Products.findById(req.params.id)
            const isReviewed = product.reviews.find((rev)=>rev.user.toString() === req.user.id.toString())
            if(isReviewed){
                product.reviews.forEach((rev)=>{
                    if(rev.user.toString() === req.user.id.toString())
                    (rev.rating = rating),(rev.comment=comment),(rev.name =name),(rev.avatar = avatar)
                })
            }else{
                product.reviews.push(review)
                product.numOfReviews = product.reviews.length
            }
            let avg = 0
            product.reviews.forEach((rev) => {
                avg += rev.rating;
            })
            product.ratings = avg / product.reviews.length
            await product.save({ validateBeforeSave: false })
            res.status(200).json({product})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    getAllReview: async(req,res)=>{
        try {
            const product = await Products.findById(req.params.id)
            if(!product){
                return res.status(400).json({msg:"Product not found"})
            }
            res.status(200).json({reviews:product.reviews})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    deleteReview: async(req,res)=>{
        try {
            const product = await Products.findById(req.params.id)
            if(!product) return res.json({msg:"Product not found"})
            const reviews = product.reviews.filter((rev)=>rev._id.toString() !== req.query.id.toString())
            let avg = 0
            reviews.forEach((rev)=>{
                avg+=rev.rating
            })
            let ratings = 0
            if(reviews.length === 0){
                ratings=0
            }else{
                ratings = avg/reviews.length
            }
            const numOfReviews = reviews.length
            const productUpdate = await Products.findByIdAndUpdate(req.params.id,{
                reviews,ratings,numOfReviews
            })
            res.status(200).json({productUpdate})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    sale: async(req,res)=>{
        try {
            const {startSale,endSale,priceSale} = req.body
            const start = new Date(startSale).getTime()
            const end = new Date(endSale).getTime()
            if(start > end) return res.status(400).json({msg:"Something went wrong"})
            await Products.findOneAndUpdate({_id: req.params.id},{
                startSale,endSale,priceSale
            })
            res.status(200).json({msg:"Create sale success"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
}


export default productCtrl