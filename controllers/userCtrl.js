import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Payments from '../models/paymentModel.js'
const userCtrl = {
    register : async (req,res)=>{
        try {
            const {name,email,password} = req.body;
            const user = await userModel.findOne({email});
            if(user) return res.status(400).json({msg:"The email already exists."});
            if(password.length < 8) return res.status(400).json({msg: "Password is at least 8 characters long."});
            const passwordhash = await bcrypt.hash(password,10);
            const newUser = new userModel({
                name,email,password:passwordhash
            })
            await newUser.save();
            const accessToken = createAccessToken({id : newUser._id});
            const refreshtoken = createRefreshToken({id : newUser._id})
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly : true,
                path : '/user/refresh_token',
                maxAge: 7*24*60*60*1000
            })
            res.json({accessToken});
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    login : async(req,res)=>{
        try {
            const {email,password} = req.body
            const user = await userModel.findOne({email})
            if(!user) return res.status(400).json({msg:"Account doesn't exist"});

            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"Incorrect password"});

            const accessToken = createAccessToken({id : user._id});
            const refreshtoken = createRefreshToken({id : user._id})
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly : true,
                path : '/user/refresh_token',
                maxAge: 7*24*60*60*1000
            })
            res.json({accessToken});
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    logout : async(req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path: '/user/refresh_token'})
            return res.json("Logged out")
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    getUser: async(req,res)=>{
        const user = await userModel.findById(req.user.id)
        if(!user) return res.status(400).json({msg:"User doesn't exist"});

        res.json({user})
    },
    refreshToken : async(req,res)=>{
       try {
           const rf_token = req.cookies.refreshtoken;
           if(!rf_token) return res.status(400).json({msg: "Please Login or Register"});

           jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
               if(err) return res.status(400).json({msg : "Please Login or Register"});
               const accesstoken = createAccessToken({id:user.id})
               res.json({user,accesstoken}) 
           })
       } catch (err) {
           return res.status(500).json({err})
       }
    },
    addCart : async(req,res)=>{
        try {
            const user = await userModel.findById(req.user.id)
            if(!user) return res.status(400).json({msg:"User doesn't exist"});
            await userModel.findOneAndUpdate({_id:req.user.id},{
                cart : req.body.cart
            })
            return res.json({msg:"Added to cart"})
        }catch (err) {
            return res.status(500).json({err})
        }
    },
    updateUserProfile : async (req,res)=>{
        try {
            const {name, email, avatar} = req.body;
            const user = await userModel.findOne({email});
            if(user) return res.status(400).json({msg:"The email already exists."});
            await userModel.findOneAndUpdate({_id: req.user.id}, {
                name, email, avatar
            })

            res.json({msg:"Update a Profile"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changePassword : async (req,res) =>{
        try {
            const user = await userModel.findById(req.user.id).select("+password");

            const isPasswordMatched = await bcrypt.compare(req.body.oldPassword,user.password);
          
            if (!isPasswordMatched) {
              return res.status(400).json({msg:"Password is incorrect"});
            }
          
            if (req.body.newPassword !== req.body.confirmPassword) {
              return res.status(400).json({msg:"New password and confirm password does not match"});
            }
            const hashPassword = await bcrypt.hash(req.body.newPassword,10)
            user.password = hashPassword;
          
            await user.save();
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history : async (req,res) =>{
        try {
            const history = await Payments.find({user_id:req.user.id})
            res.json({history})
            const user = await userModel.findById(req.user.id)
            const products = user.productsList
            history.forEach((payment)=>{
                if(payment.status === 3){
                    const cart = payment.cart
                    cart.forEach((product)=>{
                        if(!products.includes(product._id)){
                            products.push(product._id)
                            return products
                        }else{
                            return products
                        }
                    })
                }
            })
            user.productsList = products
            await user.save()
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    allHistory : async (req,res) =>{
        try {
            const history = await Payments.find()
            res.json({history})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateStoriesList: async(req,res)=>{
        try {
            await userModel.findOneAndUpdate({_id:req.user.id},{
                storiesList : req.body.storiesList
            })
            res.status(200).json({msg:"Update stories list"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    updateStatus: async(req,res)=>{
        try {
            await userModel.findOneAndUpdate({_id:req.params.id},{
                status : req.body.status, lastLogin:req.body.lastLogin
            })
            res.status(200).json({msg:"Update status"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    updatelastLogin: async(req,res)=>{
        try {
            await userModel.findOneAndUpdate({_id:req.user.id},{
                lastLogin : req.body.lastLogin
            })
            res.status(200).json({msg:"Update last login"})
        } catch (err) {
            return res.status(500).json({err})
        }
    },
    getAllUser: async(req,res)=>{
        try {
            const users = await userModel.find()
            res.status(200).json({users})
        } catch (err) {
            res.status(500).json({err})
        }
    },
    changeRole:async(req,res)=>{
        try {
            await userModel.findOneAndUpdate({_id:req.params.id},{
                role : req.body.role
            })
            res.status(200).json({msg:"Update role"})
        } catch (err) {
            res.status(500).json({err})
        }
    }
}
const createAccessToken = (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10d'})
}
const createRefreshToken = (user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}
export default userCtrl;