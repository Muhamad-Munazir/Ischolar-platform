import mongoose,{Schema} from "mongoose"

const publicationSchema = new Schema({
    
        "publicationID": {
          "type": "ObjectId",
          "required": true,
          "unique": true
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
        "journal": {
          "type": "String",
          "required": true
        },
        "year": {
          "type": "Number",
          "required": true
        },
        "doi": {
          "type": "String",
          "unique": true
        },
        "keywords": {
          "type": ["String"],
          "default": []
        },
        "fullTextUrl": {
          "type": "String" // URL to the full text of the paper
        }
     
   },

      {
        timestamps:true
      }
      
)


export const Publication = mongoose.model("publication",publicationSchema)



