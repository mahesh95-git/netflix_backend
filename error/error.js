class handlingError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorHandler = (error, req, res, next) => {
  error.statusCode || 500
  error.massage || "internal server error"
  if(error.statusCode===11000){
return res.status(409).json({success:false,message:'already exist'})
  }
 res.status(res.statusCode).json({success:false,massage:error.message})
};
module.exports = {handlingError,errorHandler};
