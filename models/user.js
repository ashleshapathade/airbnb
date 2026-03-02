const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// DO NOT add username manually
// passport-local-mongoose automatically creates username field

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);