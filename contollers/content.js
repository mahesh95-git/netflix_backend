const { sign } = require("jsonwebtoken");
const { handlingError } = require("../error/error");
const content = require("../models/content");
const { all } = require("../routers/content");

exports.addNewContent = async (req, res, next) => {
  try {
    const newContent = await content.create({
      createBy: req.User._id,
      ...req.body,
    });
    res.status(201).json({ message: "new Content added", data: newContent });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("internal server error try again", 500));
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const Content = await content.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    console.log(Content);
    if (!Content) {
      return next(new handlingError("Please Enter valid Content Id", 401));
    }
    res
      .status(201)
      .json({ suceess: true, message: "content is update  successefully " });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("internal server error try again", 500));
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const Content = await content.findByIdAndDelete(req.params.id);
    if (!Content) {
      return next(new handlingError("please enter a valid id", 401));
    }
    res
      .status(200)
      .send({ sucess: true, message: "content deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("internal server error try again", 500));
  }
};
exports.getContent = async (req, res, next) => {
  try {
    const Contents = await content.find({ _id: req.params.id });
    if (!Contents) {
      return next(new handlingError("please enter a valid id", 401));
    }
    res.status(200).json({ suceess: true, data: Contents });
  } catch (err) {
    console.log(err.message);
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.getAllSectionViseContent = async (req, res, next) => {
  try {
    let pageNumber = parseInt(req.query.page) || 1;
    let limitPerPage = parseInt(req.query.limit) || 30;
    let skip = (pageNumber - 1) * limitPerPage;
    if (!req.query.section && !req.query.type) {
      return next(
        new handlingError("please provide movieListingsection name", 401)
      );
    }
    const AllContent = await content
      .find({ section: req.query.section, type: req.query.type })
      .sort("createdAt")
      .skip(skip)
      .limit(limitPerPage);
    return res.status(201).json({
      suceess: true,
      pageNumber: pageNumber,
      limitPerPage: limitPerPage,
      AllContent,
    });
  } catch (error) {
    console.log(error.message);
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.getContentOverview = async (req, res, next) => {
  try {
    const Content = await content.aggregate([
      {
        $match: {
          type: req.query.type,
        },
      },
      { $sample: { size: 10 } },
    ]);

    return res.status(201).json({ sucess: true, Content });
  } catch (error) {
    console.log(error.message);
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.recomendationContent=()=>{
  
}