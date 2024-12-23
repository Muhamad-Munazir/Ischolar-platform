import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username:{
        type:string,
        requires:true,
        trim:true,
        unique:true
    },
    email:{

        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
     Fullname:{
        type:String,
        required: true,
        trim:true,
        index:true
    },
    country:{
        type:String,
        required: true,
        trim:true
    },
    Password:{
        type:String,
        required: [true, 'Password is requires'],
        trim:true
    },
    refreshToken:{
        type:Stirng
    }
},
    {
        timestamps:true
    }
)


userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next()
    this.Password = await bcrypt.hash(this.Password,8)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            FullName:this.FullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



userSchema.methods.generateRefreshToken = function(){ 
    jwt.sign(
    {
        _id:this._id,
   
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}


export const User  = mongoose.model("user",userSchema)