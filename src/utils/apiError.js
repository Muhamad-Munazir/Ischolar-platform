class apiError extends Error {
    constructor(
        statusCode,
        message =  "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode =statusCode
        this.daya = null
        this.message = message
        this.success = false;
        this.errors = errors

   
    }
}


export {apiError}