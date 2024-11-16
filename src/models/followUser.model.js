import mongoose,{Schema} from 'mongoose'
const followUserSchema = new Schema({
    followed_by_user_id:{
        type: Schema.Types.ObjectId, // user which is following
        ref: 'User',
       // required: true
    },
    target_user_id:{
        type: Schema.Types.ObjectId,  // user which is followed
        ref: 'User',
        // required: true
    },
   
},
    {
        timestamps:true
    },

    {
        indexes:[
            {
                fields:{followed_by_user_id:1,target_user_id:1},  //prevent duplicate follows
                unique:true
            }
        ]
    
    
        
    }
)

export const followUser =  mongoose.model("followUser",followUserSchema)