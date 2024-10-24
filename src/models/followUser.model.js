import mongoose,{Schema} from 'mongoose'
const followUserSchema = new Schema({
    followed_by_user_id:{
        type: mongoose.Schema.Types.ObjectId, // user which is following
        ref: 'User',
        required: true
    },
    target_user_id:{
        type: mongoose.Schema.Types.ObjectId,  // user which is followed
        ref: 'User',
        required: true
    },
    followed_at:{
        type:Date,
        default: Date.now
    }
},
    {
        indexes:[
            {
                fields:{followed_by_user_id:1,target_user_id:1},  //prevent duplicate follows
                unique:true
            }
        ]

    
        
})

export const followUser = new mongoose.model("followUser",followUserSchema)