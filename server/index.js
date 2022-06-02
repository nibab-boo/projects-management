// N
const mongoose = require('mongoose'); // M
const express = require("express"); // E
const app = express();
const cors = require("cors");
require('dotenv').config({ path: './../.env' });
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


app.use(cors());

// GOING TO USE JSON
app.use(express.json());


const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.41kwgus.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
// CONNECT TO MONGOOSE
mongoose.connect( url)

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    // BCRYPT USER BEFORE CREATING IT.
    const newPassword = await bcrypt.hash(req.body.password);
    // CREATE USER
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword
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
  const user = await User.findOne({ email: req.body.email})

  
  if (user) {
    const isValidPassword = await bcrypt.compare(req.body.password, user.password )
    //  CREATING TOKEN FOR SESSION
    if (!isValidPassword) return res.json({status: "error", user: "invalid password"})
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

app.get("/api/login", async (req, res) => {
  // console.log("Hello");
  const token = req.headers['x-access-token'];
  console.log(token);
  try {
    const decoded = jwt.verify(token, "secret123");
    console.log(decoded);
    const email = decoded.email;
    const user = await User.findOne(
      { email: email }
    );

    res.json({ status: "Ok", quote: user.quote })
  } catch(err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" })
  }

})
app.post("/api/quote", async (req, res) => {
  // console.log("Hello");
  const token = req.headers['x-access-token'];
  console.log(token);
  console.log(req.body)
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    console.log(email);
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }  
    );
    console.log(user.quote);

    res.json({ status: "Ok", quote: user.quote })
  } catch(err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" })
  }

})

app.listen(1234, () => {
  console.log("Server starting on 1234");
})