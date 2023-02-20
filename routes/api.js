const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const auth = require("../middleware/auth");

// user login
router.post("/login", function (req, res, next) {
  console.log("inside login 123");
  console.log(req.body);

  //  Student.findOne({ email: req.body.email, password: req.body.password })
  Student.findOne({ email: req.body.email })
    .then(async function (student) {
      if (student != null) {
        console.log("inside if of login");
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
        console.log("insideelse");
      }
    })
    .catch(next);
});

//user logout
router.get("/logout", auth, async function (req, res) {
  try {
    // console.log("req.user", req.user);

    req.user.tokens = req.user.tokens.filter((item) => {
      return item.token !== req.token;
    });

    res.clearCookie("jwt");
    //console.log("logout....");
    // await req.user.save();
    // res.send("logged out");
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
  console.log("inside post function");
  //console.log(req);
  //   console.log(req.body);

  /////To check email already registered
  Student.findOne({ email: req.body.email })
    .then(async function (student) {
      console.log("student", student);
      if (student != null) {
        console.log("inside if of login");
        res.send(400, "User already exist.");
      } else {
        console.log("insideelse");
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
        ////console.log("student....", studentData);
        const token = await studentData.generateAuthToken();
        console.log("generated token", token);

        //res.cookie(name, value, [options])

        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 60000),
          httpOnly: true,
        });

        Student.create(studentData)
          .then(function (student) {
            // console.log(student);
            res.send(student);
          })
          .catch(next);
      }
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

// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     //{} is playload - unique
//     //  jwt.sign({playload}, "secreate-key")

//     const token = await jwt.sign({_id: "6385b4d01a7e8140403a4242"}, "mynameismeghadhabaliIamasoftwaredeveloper", {
//       expiresIn: "2 seconds"
//     });
//     console.log(token);

//     const userVerify =await jwt.verify(token, "mynameismeghadhabaliIamasoftwaredeveloper");
//     console.log(userVerify);
//   }
//   createToken();

async function googleAuthentication(req, res, next) {
  console.log("ins=die google function");
  const studentData = new Student({
    email: req.body.email,
    fullName: req.body.name,
  });
  ////console.log("student....", studentData);
  const token = await studentData.generateAuthToken();
  console.log("generated token-----", token);

  //res.cookie(name, value, [options])

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 60000),
    httpOnly: true,
  });

  Student.create(studentData)
    .then(function (student) {
      console.log("student created...");
      console.log(student);

      res.send(student);
    })
    .catch(next);
}

module.exports = router;
