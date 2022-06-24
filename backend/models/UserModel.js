const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserModel.methods.matchPassword = async function (passwordSent) {
  const result = await bcrypt.compare(passwordSent, this.password);
  return result;
};

// Check why arrow function doesnot work
// This is a middleware , seriously
UserModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // console.log(this.password);
});

const User = mongoose.model("User", UserModel);

module.exports = User;
