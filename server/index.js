const mongoose = require('mongoose');
const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config({ path: './../.env' })
const User = require("./models/user.model")


const connectionParams={
  // useNewUrlParser: true,
  // // useCreateIndex: true,
  // useUnifiedTopology: true 
}

app.use(cors());
app.use(express.json());
const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.41kwgus.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
// console.log(process.env.PASSWORD)

mongoose.connect( url, connectionParams)
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    // res.send(user);
    res.json({status: "Ok"})
  } catch (err) {
    console.log(err);
    res.json({status: "error", error: "Duplicate email"})
  }

})
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email, password: req.body.password})
  
  if (user) {
    return res.json({status: "Ok", user: true})
  } else {
    return  res.json({status: "error", user: false})
  }

})

app.listen(1234, () => {
  console.log("Server starting on 1234");
})