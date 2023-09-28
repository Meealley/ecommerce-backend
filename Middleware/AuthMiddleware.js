const User = require("../Models/UserModer");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        //Getting the user from the token
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  } else {
    throw new Error("There is no token attached to the Header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("Sorry, you are not an administrator");
  } else {
    next();
  }

  console.log(req.user);
});

module.exports = { authMiddleware, isAdmin };
