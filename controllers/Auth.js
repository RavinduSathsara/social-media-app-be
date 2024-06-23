const {
  User,
  UserSchema,
  validateUser,
  validateLogin,
} = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc    Register new user
// @route   POST/api/auth/register
// @access  PUBLIC
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, contactNo, homeAddress, password } = req.body;

    // check for validation
    const { error } = validateUser(req.body);
    if (!error) return next(new ErrorResponse(error.details[0].message, 400));

    let user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorResponse("The user email address already exists", 400)
      );
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    user = await User.create({
      name: name,
      email: email,
      contactNo: contactNo,
      homeAddress: homeAddress,
      password: hashedPassword,
    });

    // create JWT token
    function generateToken() {
      return jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
    }

    const token = generateToken();

    res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    next(error.message, 500);
  }
};

// @desc    Login users
// @route   POST/api/auth/login
// @access  PUBLIC
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate login credentials
    const { error } = validateLogin(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    // check for user in the database
    let user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorResponse("Invalid email or password", 400));

    // check for password validity
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return next(new ErrorResponse("Invalid email or password", 400));
    } else {
      // create JWT token
      // create JWT token
      function generateToken() {
        return jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );
      }
      const token = generateToken();

      res.status(200).json({
        success: true,
        token: token,
      });
    }
  } catch (error) {
    next(error.message, 500);
  }
};
