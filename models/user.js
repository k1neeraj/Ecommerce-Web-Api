const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
  apartment:{
    type: String,
    default: '',
  },
  zip:{
    type: String,
    default: '',
  },
  city:{
    type: String,
    default: '',
  },
  country:{
    type: String,
    default: '',
  }
});

// this code is used to convert _id in mongodb to id for friendly frontend development use
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;