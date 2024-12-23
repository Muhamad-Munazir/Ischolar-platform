import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,"./Public/temp")
    },
    filename: function (req,res,cb) {
       
        cb(null,file.originalname)
    }

})

export const upload = multer({
    storage,
})