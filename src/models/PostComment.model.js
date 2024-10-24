import mongoose,{Schema} from 'mongoose'

const PostCommentSchema = new Schema({
    user_who_comment_id:{
        type:Schema.Types.ObjectId,
        ref: 'User',
       
    },
    community_post_commented:{
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },

    comment_content:{
        type:String,
        required:true
    }

},
    {
        timestamps:true
    }
)

export const PostComment = new mongoose.model("PostComment",PostCommentSchema)