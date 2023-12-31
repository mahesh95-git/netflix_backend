class handlingError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorHandler = (error, req, res, next) => {

  if (error.statusCode === 11000) {

    return res.status(409).json({ success: false, message: "already exist" });
  }
  if (error) {
    return res
      .status(res.statusCode)
      .json({ success: false, message: error.message });
  }
};
module.exports = { handlingError, errorHandler };
