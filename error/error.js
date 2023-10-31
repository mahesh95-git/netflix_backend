class handlingError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorHandler = (error, req, res, next) => {
  error.message || "interanl server error"
  error.statusCode || 500;
  if (error) {
   
    return res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  } 
};
module.exports = {handlingError,errorHandler};
