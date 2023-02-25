const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const auth = require("../middleware/auth");

// user login
router.post("/login", function (req, res, next) {

  Student.findOne({ email: req.body.email, password: req.body.password })
    .then(async function (student) {
      if (student != null) {
        const token = await student.generateAuthToken();

        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 60000),
          httpOnly: true,
          //secure: true //only runs on https
        });
        res.send(student);
      } else if (req.body.name) {
        googleAuthentication(req, res, next);
      } else {
        res.send(400, "Something went wrong");
      }
    })
    .catch(next);
});

//user logout
router.get("/logout", auth, async function (req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((item) => {
      return item.token !== req.token;
    });

    res.clearCookie("jwt");
    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all list of students from the database
router.get("/students", auth, function (req, res, next) {
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
router.post("/students", async function (req, res, next) {

  /////To check email already registered
  Student.findOne({ email: req.body.email })
    .then(async function (student) {
      if (student != null) {
        res.send(400, "User already exist.");
      } else {
        const studentData = new Student({
          fullName: req.body.fullName,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
          state: req.body.state,
          city: req.body.city,
          zip: req.body.zip,
          date: req.body.date,
        });
        const token = await studentData.generateAuthToken();

        //res.cookie(name, value, [options])

        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 60000),
          httpOnly: true,
        });

        Student.create(studentData)
          .then(function (student) {
            res.send(student);
          })
          .catch(next);
      }
    })
    .catch(next);
});

// update a student in the database
router.put("/students/:id", function (req, res, next) {
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


async function googleAuthentication(req, res, next) {
  const studentData = new Student({
    email: req.body.email,
    fullName: req.body.name,
  });
  const token = await studentData.generateAuthToken();

  //res.cookie(name, value, [options])

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 60000),
    httpOnly: true,
  });

  Student.create(studentData)
    .then(function (student) {
      res.send(student);
    })
    .catch(next);
}

module.exports = router;
