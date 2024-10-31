import {Router} from "express";
import { loginUser, logoutUser, RefreshAccessToken, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)   // registeUser.js will not be taken as its not a function


router.route("/login").post(loginUser)

//Secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refres-token").post(RefreshAccessToken)




export default router