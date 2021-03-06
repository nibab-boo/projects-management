// N
const mongoose = require('mongoose'); // M
const express = require("express"); // E
const app = express();
const cors = require("cors");
require('dotenv').config({});
// require('dotenv').config({ path: './../.env' });
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Console } = require('console');

const PORT = process.env.PORT || 1234


app.use(cors());

// GOING TO USE JSON
app.use(express.json());

const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.41kwgus.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
// CONNECT TO MONGOOSE
mongoose.connect(url)

app.post("/api/register", async (req, res) => {
  try {
    // BCRYPT USER BEFORE CREATING IT.
    const newPassword = await bcrypt.hash(req.body.password, 10);
    // CREATE USER
    await User.create({
      name: req.body.name,
      email: req.body.email,
      quote: req.body.quote,
      password: newPassword,
    })
    const user = await User.findOne({
      email: req.body.email,
      password: newPassword
    })
    //  CREATING TOKEN FOR SESSION
    console.log(user);
    if (user) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.SECRETKEY
      )
      console.log(token);
      res.json({status: "Ok", user: token})
    } else {
      res.json({status: "Pending"})
    }
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
      process.env.SECRETKEY
    )
    return res.json({status: "Ok", user: token})
  } else {
    return  res.json({status: "error", user: false})
  }

})

app.get("/api/user", async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const email = decoded.email;
    const user = await User.findOne(
      { email: email }
    );
    res.json({ status: "Ok", username: user.name, quote: user.quote, projects: user.projects })
  } catch(err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" })
  }
})


app.post("/api/quote", async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }  
    );

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
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const email = decoded.email;
    const response = await User.updateOne(
      { email: email },
      { $push: {
          projects: req.body.project 
      }}
    )
    if (response.acknowledged) {
 
      // GIVES USER WITH ONLY ID AND ONE PROJECT
      // const user = await User.findOne(
      //   { email: email, "projects.name": req.body.project.name},
      //   { "projects.$": 1 }
      //   )
      res.json({status: "Ok"})
    } else {
      res.json({ status: "error", error: "Unable to add project"})
    }
  } catch(err) {
    console.log(err);
    res.json({status: "error", error: err})
  }
})


app.delete("/api/projects/:id", async (req, res) => {
  // console.log(req.params.id)
  const toDeleteId = req.params.id
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
  
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


app.put("/api/projects/:id", async (req, res) => {
  console.log("Herre");
  const toUpdateId = req.params.id;
  const token = req.headers["x-access-token"];

  console.log("id", toUpdateId);
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const projectId = new mongoose.Types.ObjectId(toUpdateId);

    const response = await User.updateOne({
      email: decoded.email,
      'projects._id': projectId,
    }, {
      $set: {
        'projects.$': req.body.project
      }
    })
    console.log(response);
    res.json({status: "Ok"})

  } catch (err) {
    console.log(err);
    res.json( { status: "error", error: "Update failed."} )
  }
});



app.post("/api/projects/:id/status", async (req, res) => {
  const toUpdateId = req.params.id;
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);

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
      res.json({ status: "error", error: "Please, retry again" })
    }
    // console.log(projectId, decoded);
  } catch (err) {
    console.log(err)
    res.json({status: "error", error: "Action Failed"})
  }
})


app.get("/api/projects/:id", async (req, res) => {
  const toUpdateId = req.params.id;
  console.log(toUpdateId);
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    const projectId = mongoose.Types.ObjectId(toUpdateId);

      // RETRIVING ONLY ONE PROJECT
      const user = await User.findOne({
        email: decoded.email,
        "projects._id": projectId,
      }, 
      {
        "projects.$": 1,
      })

      res.json({ status: "Ok", project: user.projects[0] })
    // console.log(projectId, decoded);
  } catch (err) {
    console.log(err)
    res.json({status: "error", error: "Action Failed"})
  }
})
        

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}


app.listen(PORT, () => {
  console.log("Server starting on 1234");
})