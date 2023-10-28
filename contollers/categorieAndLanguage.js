const { handlingError } = require("../error/error");
const { genre, language } = require("../models/categorieAndLanguage");
genre;
exports.addGenreOrLanguage = async (req, res, next) => {
  try {
    console.log(req.query.genre);
    if (req.query.genre) {
      console.log("ne");
      await genre.create({ genre: req.query.genre });
      return res
        .status(201)
        .json({ success: true, message: "genre added successfully" });
    } else if (req.query.language) {
      await language.create({ language: req.query.language });
      return res
        .status(201)
        .json({ success: true, message: "language added successfully" });
    } else {
      return next(new handlingError("Bad Request", 400));
    }
  } catch (error) {
    console.log(error.message);
    return next(new handlingError(error.message, 500));
  }
};
exports.getAllGenreOrLanguage = async (req, res, next) => {
  try {
    if (req.query.q === "genre") {
      const genres = await genre.find();
      if (!genres) {
        return next(new handlingError("Not Found", 404));
      }
      console.log(genres);
      return res.status(200).json({ success: true, data: genres });
    } else if (req.query.q === "language") {
      const languages = await language.find();
      if (!languages) {
        return next(new handlingError("Not Found", 404));
      }
      return res.status(200).json({ success: true, data: languages });
    } else {
      return next(new handlingError("Bad Request", 400));
    }
  } catch (err) {
    console.log(err.message);
    return next(new handlingError("Internal Server Error", 500));
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    const genreId = req.params.id;
    const deletegenre = await genre.findByIdAndDelete(genreId);
    if (!deletegenre) {
      return next(new handlingError("Not Found", 404));
    }
    return res
      .status(200)
      .send({ success: true, message: "deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    return next(new handlingError("Internal Server Error", 500));
  }
};

exports.deletelanguage = async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const deletelanguage = await language.findByIdAndDelete(languageId);
    if (!deletelanguage) {
      return next(new handlingError("Not Found", 404));
    }

    return res
      .status(200)
      .send({ success: true, message: "deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("Internal Server Error", 500));
  }
};
