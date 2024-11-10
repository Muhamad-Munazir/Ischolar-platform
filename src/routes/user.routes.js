import {Router} from "express";
import { changeCurrentPassword, 
       getCurrentUser,
       getUserPageProfile, 
       loginUser,
       logoutUser, 
       RefreshAccessToken,
       registerUser,
       updateAccountDetails 
       } from "../controllers/user.controller.js";



import  { postRemove, postUpload } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


// register route
router.route("/register").post(registerUser)   // registeUser.js will not be taken(in a high order function ) as its not a function

//login route
router.route("/login").post(loginUser)









//Secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(RefreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateAccountDetails)
router.route("/users/:username").get(verifyJWT,getUserPageProfile)


 // post-upload routes
router.route("/upload").post(upload.single('file'),verifyJWT,postUpload)
       
// post/publication-Remove route
router.route("/publication/:postId").delete(verifyJWT,postRemove)




export default userRouter