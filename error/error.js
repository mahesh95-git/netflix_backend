class handlingError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorHandler = (error, req, res, next) => {

  if (error) {
    console.log(error.message)
    return res
      .status(error.statusCode)
      .json({ success: false, message:error.message});
  }
};
module.exports = { handlingError, errorHandler };
