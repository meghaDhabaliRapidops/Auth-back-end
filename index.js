require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
require("dotenv/config"); // configure reading from .env
//const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");


// set up our express app
const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:3006"],
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//   })
// )

// connect to mongodb
mongoose.connect('mongodb://localhost/my-school');
mongoose.Promise = global.Promise;

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static('public'));

app.use(express.json());

app.use(cookieParser());

// initialize routes
app.use('/api',require('./routes/api'));

// error handling middleware
app.use(function(err,req,res,next){
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.port || 4000, function(){
    console.log('Ready to Go!');
});