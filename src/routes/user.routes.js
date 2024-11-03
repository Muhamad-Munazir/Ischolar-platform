import {Router} from "express";
import { loginUser, logoutUser, RefreshAccessToken, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)   // registeUser.js will not be taken(in a high order function ) as its not a function


router.route("/login").post(loginUser)

//Secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(RefreshAccessToken)




export default router