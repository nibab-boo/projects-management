const mongoose = require('mongoose');

const Project = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true },
    urlLink: { type: String, unique: true },
    repoLink: { type: String, unique: true },
    status: { type: String, enum: ["WAITING", "ONGOING", "COMPLETED"], default: "WAITING" },
    stacks: [String],
    hosting: { type: String, required: true }
  }
)

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    quote: { type: String },
    projects: [Project]
  },
  { collection: 'user-data'}
)

const model = mongoose.model('UserData', User);

module.exports = model;
