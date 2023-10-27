class handlingError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorHandler = (error, req, res, next) => {
  if(error.message="E11000 duplicate key error collection"){
    return res.status(409).json({success:false,message:" already exist"})
  }
  if (error) {
    return res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  } else {

    return res.status(500).send("An unknown error occurred");
  }
};
module.exports = {handlingError,errorHandler};
