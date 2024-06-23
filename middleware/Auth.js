const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return next(new ErrorResponse("Access denied. No token provided", 401));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch (e) {
      next(new ErrorResponse(e.message, 500));
    }
  }
};

module.exports = auth;
