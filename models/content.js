const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ContentSchema = Schema({
  title: {
    type: String,
    required: [true, "Please provide a Title"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "please provide movie description"],
  },
  year: {
    type: Number,
    minlength: 4,
    maxlength: 4,
    required: [true, "Please provide a Year"],
  },
  banner: {
    type: String,
    required: [true, "Banner is required"],
  },
  image: { type: String, required: [true, "Plot is required"] },
  rating: {
    type: Number,
    default: 0,

    // enum:["G", "PG","R","NC-17"],
  },
  languages: [
    {
      language: {
        type: String,
        required: [true, "Please provide movie language"],
      },
    },
  ],
  trailer: {
    type: String,
    unique: true,
    required: [true, "Please provide movie trailer "],
  },
  fullMovie: {
    unique: true,
    type: String,
    required: [true, "Please provide movie "],
  },
  duration: {
    type: Number,
    required: [true, "Please provide movie duration "],
  },
  type: {
    type: String,
    required:true
  },
  director: {
    name: { type: String },
    image: {
      type: String,
    },
  },
  cast: [
    {
      actorName: { type: String },
      actorImage: { type: String },
    },
  ],
  genres: [
    {
      genre: {
        type: String,
        required: [true, "Please provide a Genre"],
        required: true,
      },
    },
  ],
  section: {
    type: String,
    required: [true, "Section is Required"],
  },
  createBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt:{
    type : Date ,
    default : new Date()

  }
});

module.exports = mongoose.model("content", ContentSchema);
