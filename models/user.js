const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  avatar: [
    {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dyjmwxfb4/image/upload/v1700720301/user-profile-icon-front-side-with-white-background_187299-40010_xglyal.avif",
      },
      public_id: String,
    },
  ],
  phone: {
    type: Number,
    required: true,
    unique: [true, "this phone already use try again"],
    validator: Validator.default.isMobilePhone,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "this email id already use try again"],
    validator: Validator.default.isEmail,
  },
  password: { type: String, required: true, minLength: 8 },
  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["user", "admin"],
  },
  status: {
    type: String,
    default: "unBlock",
    enum: ["unBlock", "Block"],
    required: true,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const cryptedPassword = await bcrypt.hash(this.password, 10);
  this.password = cryptedPassword;
});
userSchema.methods.jwtTokenGenrator = function () {
  const jwtToken = jwt.sign({ id: this._id }, process.env.secretKey);
  return jwtToken;
};
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.virtual;
module.exports = mongoose.model("user", userSchema);
