const User = require("../Models/UserModer");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Cart = require("../Models//CartModel");
const Product = require("../Models/ProductModel");
const Coupon = require("../Models/CouponModel");
const Order = require("../Models/OrderModel");
const { generateToken } = require("../Config/jwtToken");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");
const { generateRefreshToken } = require("../Config/refreshtoken");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("./EmailController");

//POST Create a new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    //Create a new User
    const newUser = User.create(req.body);
    res.json(newUser);
  } else {
    // User already exists
    throw new Error("User already exists");
  }
});

//POST Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check if user already exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not Found Please sign up");
  }

  //   const correctPassword = await bcrypt.compare(password, user.password);
  const correctPassword = await user.isPasswordMatched(password);

  if (user && correctPassword) {
    const refreshToken = await generateRefreshToken(user._id);
    const updateUser = await User.findByIdAndUpdate(
      user.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }

  //   console.log(email, password);
});

//POST Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check if user already exists
  const admin = await User.findOne({ email });
  if (!admin) {
    res.status(400);
    throw new Error("User not Found Please sign up");
  }
  if (admin.role !== "admin") throw new Error("Not authorized");
  //   const correctPassword = await bcrypt.compare(password, admin.password);
  const correctPassword = await admin.isPasswordMatched(password);

  if (admin && correctPassword) {
    const refreshToken = await generateRefreshToken(admin._id);
    const updateUser = await User.findByIdAndUpdate(
      admin.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: admin._id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      mobile: admin.mobile,
      token: generateToken(admin._id),
    });
  } else {
    throw new Error("Invalid admin Credentials");
  }

  //   console.log(email, password);
});

//HANDLE REFRESHTOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No Refresh token available in cookies");

  const refreshToken = cookie.refreshToken;
  //   console.log(refreshToken);

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("User not found");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
  //   res.json(user);

  // console.log(cookie);
});

//GET LOGout functionality
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No Refresh token available in cookies");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //Forbiden
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //Forbiden
});

//<===================== Save the user address =============
const saveUserAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error("Couldn't save the  User address" + error.message);
  }
});

//GET all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    throw new Error("Couldn't find users");
  }
});

//GET a Single User
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error("User ID not found");
  }
});

//DELETE a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const user = await User.findByIdAndDelete(id);
    res.json({
      message: "User deleted",
    });
  } catch (error) {
    throw new Error("User ID not found, so could not delete");
  }
});

//PUT UPDATE a user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
        password: req?.body.password,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error("Couldn't  Update User");
  }
});

//PUT BLOCK users
const blockUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(block);
  } catch (error) {
    throw new Error("Cannot block user");
  }
});

//PUT UNBLOCK users
const unblockUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error("Cannot unblock user");
  }
});

//PUT UPDATEPASSWORD
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  validateMongoDbId(_id);

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json({ message: "Password updated" });
  }
  console.log(req.body);
});

//GENERATE FORGOT PASSWORD
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, Please click this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5100/api/auth/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error("Couldn't try forgot password " + error.message);
  }
});

//PUT RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, Please try again later.");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

//<================== Get the wishlist
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate("wishlist");
    res.json(user);
  } catch (error) {
    throw new Error("Couldn't get wishlist" + error.message);
  }
});

//<======================= POST User cart(Creating cart and cart total logic) =================
const userCart = asyncHandler(async (req, res) => {
  const { _id } = req.user; // this is id is the id gotten from the middleware authMiddleware
  const { cart } = req.body;

  validateMongoDbId(_id);

  try {
    let products = [];
    const user = await User.findById(_id);
    //Check if user already have product in cart
    //if the id is presenting orderby cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    // console.log(products);

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // console.log(products, cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error("Couldn't get user cart " + error.message);
  }
});

//<============================ GET getting the user cart =================
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    // if (!cart) {
    //   res.json({ message: "Your cart is Empty!" });
    // }
    res.json(cart);
  } catch (error) {
    throw new Error("Couldn't get the user cart " + error.message);
  }
});

//<=============================== DELETE Empty cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });

    res.json(cart);
  } catch (error) {
    throw new Error("Couldn't get the user cart " + error.message);
  }
});

//<=============================POST Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon == null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({
      orderby: user._id,
    }).populate("products.product");

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
    // console.log(validCoupon)
  } catch (error) {
    throw new Error("Couldn't find the coupon " + error.message);
  }
});

//<=============================== POST Create Order =============================
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { COD, couponApplied } = req.body;
  validateMongoDbId(_id);
  const uniqId = uuidv4();
  console.log(uniqId);

  try {
    if (!COD) throw new Error("Create cash Order failed");
    const user = await User.findById(_id);

    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqId,
        method: "COD",
        amount: finalAmount,
        status: "Cash on delivery",
        created: Date.now(),
        currency: "USD",
      },

      orderby: user._id,
      orderStatus: "Cash on delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});
    res.status(201).json({
      message: "success",
    });
  } catch (error) {
    throw new Error("Couldn't create Order coupon " + error.message);
  }
});

//<================================= GET Getting the Order =================
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const userOrders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error("Couldn't get orders " + error.message);
  }
});

//<================================= PUT Update orders status =================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  validateMongoDbId(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    throw new Error("Couldn't update order status" + error.message);
  }

  //   res.json({
  //     message : "Update order status"
  //   })
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUsers,
  unblockUsers,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
