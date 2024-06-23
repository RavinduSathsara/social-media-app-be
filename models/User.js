const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add username"],
      trim: true,
      minlength: [2, "Name should be longer than 2 characters"],
      maxlength: [50, "Name should not be longer than 50 character"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please add an email address"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    contactNo: {
      type: String,
      required: [true, "Please add a Contact No"],
      trim: true,
      minlength: [10, "Contact No should be 10 characters"],
      maxlength: [10, "Contact No should be 10 characters"],
    },
    homeAddress: {
      type: String,
      required: [true, "Please add a Home Address"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      trim: true,
      minlength: [4, "Password should be longer than 4 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// user login data validation - email and password
const validateLogin = (loginData) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required().min(4),
  });

  return schema.validate(loginData);
};

// create user model
const User = mongoose.model("User", UserSchema);

// validation user model
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required().min(4),
    role: Joi.string().required(),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  UserSchema,
  validateUser,
  validateLogin,
};
