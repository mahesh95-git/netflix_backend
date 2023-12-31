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
  banner: 
    {
      url: {
        type: String,
        required: true,
      },
      
      public_id: {
        type: String,
        required: true,
      },
    },
  
  poster: 
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  
  languages: {
    type:Array
  },
  trailer: 
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  
  fullMovie: 
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  
  // duration: {
  //   type: Number,
  //   required: [true, "Please provide movie duration "],
  // },
  type: {
    type: String,
    required: true,
  },
  director: {
    name: { type: String },
 
  },
  cast:  {
    type:Array
  },
  genres: {
    type:Array
  }
  ,
  section: {
    type: String,
    required: [true, "Section is Required"],
  },
  createBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("content", ContentSchema);
