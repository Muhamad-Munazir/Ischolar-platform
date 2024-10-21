// using promises mehtod

const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }

}




export {asyncHandler}



// using try-catch method


// const asyncHandler = (requestHandler) => async (req,res,next) => {
//     try {
//         await requestHandler(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }