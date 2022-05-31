// N
const mongoose = require('mongoose'); // M
const express = require("express"); // E
const app = express();
const cors = require("cors");
require('dotenv').config({ path: './../.env' });
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');



app.use(cors());

// GOING TO USE JSON
app.use(express.json());


const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.41kwgus.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
// CONNECT TO MONGOOSE
mongoose.connect( url)

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    // CREATE USER
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    // res.send(user);
    res.json({status: "Ok"})
  } catch (err) {
    // IF CREATE FAILED
    console.log(err);
    res.json({status: "error", error: "Duplicate email"})
  }

})
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  // CHECK IF USER EXISTS OR NOT
  const user = await User.findOne({ email: req.body.email, password: req.body.password})
  
  if (user) {
    //  CREATING TOKEN FOR SESSION
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      'secret123'
    )
    return res.json({status: "Ok", user: token})
  } else {
    return  res.json({status: "error", user: false})
  }

})

app.listen(1234, () => {
  console.log("Server starting on 1234");
})