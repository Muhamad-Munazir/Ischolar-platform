import mongoose, {Schema} from "mongoose"

const communitypostSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    content:{
        type:string,
        required:true
    },
    media_url:{
        type:string,   /// link of media 
        required:false
    },
    visibility:{
        type:string,
        enum: ['public', 'private', 'followers-only'],
        default: 'public'
    }
},  
    {
        timestamps:true
    }

)

export const Community = new mongoose.model("community",communitypostSchema)







