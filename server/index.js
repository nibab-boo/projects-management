// N
const mongoose = require('mongoose'); // M
const express = require("express"); // E
const app = express();
const cors = require("cors");
require('dotenv').config({ path: './../.env' });
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 1234

app.use(cors());

// GOING TO USE JSON
app.use(express.json());


const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.41kwgus.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
// CONNECT TO MONGOOSE
mongoose.connect(url)

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    // BCRYPT USER BEFORE CREATING IT.
    const newPassword = await bcrypt.hash(req.body.password, 10);
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
    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    //  CREATING TOKEN FOR SESSION
    if (!isValidPassword) return res.json({status: "error", user: "invalid password"})
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      'secret123'
    )
    console.log(token);
    return res.json({status: "Ok", user: token})
  } else {
    return  res.json({status: "error", user: false})
  }

})

app.get("/api/login", async (req, res) => {
  // console.log("Hello");
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne(
      { email: email }
    );
    // console.log(user.projects);
    res.json({ status: "Ok", quote: user.quote, projects: user.projects })
  } catch(err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" })
  }

})
app.post("/api/quote", async (req, res) => {
  const token = req.headers['x-access-token'];
  console.log(token);
  console.log(req.body)
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }  
    );
    console.log(user);

    res.json({ status: "Ok", quote: user.quote })
  } catch(err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" })
  }

})

app.post("/api/projects/new", async(req, res) => {
  const token = req.headers['x-access-token'];
  console.log(req.body.project);
  // res.json({status: "OK", project: req.body})
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const response = await User.updateOne(
      { email: email },
      { $push: {
          projects: req.body.project 
      }}
    )
    if (response.acknowledged) {
 
      // GIVES USER WITH ONLY ID AND ONE PROJECT
      const user = await User.findOne(
        { email: email, "projects.name": req.body.project.name},
        { "projects.$": 1 }
        )
      res.json({status: "Ok", project: user.projects[0]})
    } else {
      res.json({ status: "error", error: "Unable to add project"})
    }
  } catch(err) {
    console.log(err);
    res.json({status: "error", error: err})
  }
})


app.delete("/api/projects/:id/delete", async (req, res) => {
  // console.log(req.params.id)
  const toDeleteId = req.params.id
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, "secret123");
  
    const projectId = (mongoose.Types.ObjectId(toDeleteId));
    console.log(projectId)
    // DELETE SUB DOCUMENT FROM ARRAY
    const user = await User.updateOne({
      email: decoded.email,
    }, {
      "$pull": {
        "projects": {
          "_id": projectId
        }
      }
    }
    );
    console.log(user);
    res.json({status: "Ok", id: toDeleteId})
  } catch (err) {
    console.log(err);
    res.json({status: "error", error: "Delete process unfulfilledd"})
  }
})

app.post("/api/projects/:id/status", async (req, res) => {
  const toUpdateId = req.params.id;
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, "secret123");

    const projectId = mongoose.Types.ObjectId(toUpdateId);

    const response = await User.updateOne({
      email: decoded.email,
        "projects._id": projectId,
      }, {
        $set: {
          "projects.$.status": req.body.status,
        } 
      }
    )

    if (response.acknowledged && response.modifiedCount ) {
      // RETRIVING ONLY ONE PROJECT
      const user = await User.findOne({
        email: decoded.email,
        "projects._id": projectId,
      }, 
      {
        "projects.$": 1,
      })

      res.json({ status: "Ok", project: user.projects[0] })
    } else {
      res.json({ status: "error", errro: "Sorry for inconvience. Please, retry again." })
    }
    // console.log(projectId, decoded);
  } catch (err) {
    console.log(err)
    res.json({status: "error", error: "Action Failed"})
  }
})



app.listen(PORT, () => {
  console.log("Server starting on 1234");
})