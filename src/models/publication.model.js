import mongoose,{Schema} from "mongoose"

const publicationSchema = new Schema({
  
        "userId":{
          "type":Schema.Types.ObjectId,
          "ref":"User",
          "required":true
        },

        // "publicationID": {
        //   "type": Schema.Types.ObjectId,
        //   "required": true,
        //   "unique": true
        // },
        "caption": { 
          type: String, 
          trim: true 
        },
        "title": {
          "type": "String",
          "required": true
        },
        "abstract": {
          "type": "String",
          "required": true
        },
        "authors": {
          "type": ["ObjectId"],
          "ref": "User",
          "required": true
        },
        // "journal": {
        //   "type": "String",
        //   "required": true
        // },
        // "year": {
        //   "type": "Number",
        //   "required": true
        // },
        "doi": {
          "type": "String",
          "unique": true
        },
        "keywords": {
          "type": ["String"],
          "default": []
        },
        "fileUrl": {
          "type": "String" // URL to the full text of the paper
        },
        "fileType":{
          type:String
        }
     
   },

      {
        timestamps:true
      }
      
)

export const Publication = mongoose.model("publication",publicationSchema)



