import mongoose,{Schema} from "mongoose"

const userProfilesSchema  = new Schema({
    Description:{
        type:String,
        required:[true,"Please provide your description to maintain a good profile"],
    },
    Website:{
        type:String,
        required:false,
    },
    Location:{
        type: string, // POINT for GeoJSON
        enum: ['Point'],
        required:true
    },
    Institute:{
        type:string,
        required:true,

    }
},
   {timestamps:true}
)

export const UserProfile = mongoose.model("userProfile",userProfilesSchema)