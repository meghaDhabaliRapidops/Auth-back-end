const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

// create student schema & model
const StudentSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name field is required"],
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
  },
  password: {
    type: String,
    //required: [true, "Password field is required"],
    //deafult: true
  },
  gender: {
    type: String,
    default: "Male",
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zip: {
    type: String,
  },
  date: {
    type: String,
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
  }]
});


//generating tokens
StudentSchema.methods.generateAuthToken = async function() {
  console.log('Hey')
  console.log("this._id", this._id);
    try {
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        console.log("token", token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        
    } catch (error) {
        // res.send("throwing an error");
        console.log("inside error");
        console.log(error);
    }
}

// StudentSchema.methods.generateAuthToken = async function() {
//     try {
//         const token = jwt.sign({_id: this._id.toString()}, "mynameismeghadhabaliIamsoftwaredeveloper");
//         console.log(token);
        
//     } catch (error) {
//         res.send("throwing an error");
//         console.log(error);
//     }
// }


const Student = mongoose.model("student", StudentSchema);

module.exports = Student;
