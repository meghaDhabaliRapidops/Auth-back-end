const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// user login
router.post("/login", function (req, res, next) {
    console.log("inside post function");
    //console.log(req);
    console.log(req.body);
    Student.findOne({email: req.body.email, password: req.body.password })
      .then(function (student) {
         console.log(student);
        res.send(student);
      })
      .catch(next);
  });

// get all list of students from the database
router.get("/students", function (req, res, next) {
  Student.find({})
    .then(function (students) {
      res.send(students);
    })
    .catch(next);
});

// get a student from the database
router.get("/students/:id", function (req, res, next) {
  Student.find({ _id: req.params.id })
    .then(function (students) {
      res.send(students);
    })
    .catch(next);
});

// add a new student to database
router.post("/students", function (req, res, next) {
  console.log("inside post function");
  //console.log(req);
  console.log(req.body);
  Student.create(req.body)
    .then(function (student) {
      // console.log(student);
      res.send(student);
    })
    .catch(next);
});

// update a student in the database
router.put("/students/:id", function (req, res, next) {
  console.log("inside put function");
  console.log(req.params.id);
  Student.findOneAndUpdate({ _id: req.params.id }, req.body).then(function (
    student
  ) {
    Student.findOne({ _id: req.params.id }).then(function (student) {
      res.send(student);
    });
  });
});

// delete a student in the database
router.delete("/students/:id", function (req, res, next) {
  Student.findOneAndDelete({ _id: req.params.id }).then(function (student) {
    res.send(student);
  });
});

const jwt = require("jsonwebtoken");

const createToken = async() => {
    //{} is playload - unique
    //  jwt.sign({playload}, "secreate-key")
  
    const token = await jwt.sign({_id: "6385b4d01a7e8140403a4242"}, "mynameismeghadhabaliIamasoftwaredeveloper", {
      expiresIn: "2 seconds"
    });
    console.log(token);
  
    const userVerify =await jwt.verify(token, "mynameismeghadhabaliIamasoftwaredeveloper");
    console.log(userVerify);
  }
  createToken();

module.exports = router;
