import userModel from "../models/userModel.js";

const authAdmin = async (req,res,next)=>{
   try {
       const user = await userModel.findOne({_id:req.user.id})
       if(user.role===0) return res.status(400).json({msg:"Admin access denied"})
       next();
   } catch (err) {
       return res.status(500).json({err})
   }
}
export default authAdmin