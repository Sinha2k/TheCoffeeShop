import categoryModel from "../models/categoryModel.js";
const categoryCtrl = {
    getCategory : async (req,res)=>{
        try {
            res.json({msg:"Test"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    createCategory : async (req,res)=>{
        try {
            const {name} = req.body
            const category = await categoryModel.findOne({name})
            if(category) return res.status(400).json({msg:"This category already exist"})
            const newCategory = new categoryModel({name})
            await newCategory.save()
            res.json({msg:"Create a Category"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    deleteCategory: async (req,res)=>{
        try {
            await categoryModel.findByIdAndDelete(req.params.id)
            res.status(400).json({msg:"Delete a category"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    updateCategory: async (req,res)=>{
        try {
            const {name} = req.body
            await categoryModel.findOneAndUpdate({_id:req.params.id},{name})
            res.status(400).json({msg:"Update a category"})
        } catch (err) {
            return res.status(500).json({err})
        }
    }
}
export default categoryCtrl