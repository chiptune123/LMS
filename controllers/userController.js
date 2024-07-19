const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const config = require("../config/auth.config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CartModel = require("../models/carts");

const BOOK_LIST_URL = "/books";
const USER_MANAGEMENT_PAGE = "user_management";

// exports.user_list = asyncHandler(async (req, res, next) => {
//   const allUsers = await User.find({}, "username name email")
//     .sort({ username: 1 })
//     .exec();
//   res.render("user_list", { title: "User List", user_list: allUsers });
// });

exports.user_list_by_member = asyncHandler(async (req, res, next) => {
  try {
    const allMember = await User.find({ role: "User" })
      .sort({ username: 1 })
      .exec();

    if (allMember) {
      if (req.baseUrl == "/admin") {
        res.render(USER_MANAGEMENT_PAGE, { title: "Member Collection", user_list: allMember });
        return;
      }
      //res.render("user_list", { title: "User List", user_list: allUsers });
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.user_list_by_staff = asyncHandler(async (req, res, next) => {
  try {
    const allStaff = await User.find({ role: "Librarian" })
      .sort({ username: 1 })
      .exec();

    if (allStaff) {
      if (req.baseUrl == "/admin") {
        res.render(USER_MANAGEMENT_PAGE, { title: "Staff Collection", user_list: allStaff });
        return;
      }
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

// 
exports.user_profile = asyncHandler(async (req, res, next) => {
  const userDetail = await User.findOne({ username: req.params.id }).exec();
  res.render("user_detail", { user_information: userDetail });
});

// User manipulate on POST HTTP method
exports.user_create_post = [
  // Validate and sanitizer field
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified"),
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric character"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified"),
  // Start to process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract result object from express-validator
    const errors = validationResult(req);

    //Create User object with validation data
    const NewUser = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name,
      email: req.body.email,
      // Other field has default value for user to optional setup
    });

    if (!errors.isEmpty()) {
      // If there are errors, render the form again with validation data and errors object
      res.render("sign_up_form", {
        title: "Create User",
        user: NewUser,
        errors: errors.array(),
      });
    } else {
      await NewUser.save();
      res.redirect("/");
    }
  }),
];

exports.user_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric character"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified"),
  // Start to process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract result object from express-validator
    const errors = validationResult(req);

    //Create User object with validation data
    const NewUser = new User({
      username: req.params.id,
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      role: req.body.role,
      verificationStatus: req.body.verificationStatus,
      profilePicture: req.body.profilePicture,
      deleteStatus: req.body.deleteStatus,
      deleteReason: req.body.deleteReason,
      // Other field has default value for user to optional setup
    });

    if (!errors.isEmpty()) {
      // If there are errors, render the form again with validation data and errors object
      res.render("user_update_form", {
        title: "Update User",
        user: NewUser,
        errors: errors.array(),
      });
    } else {
      const updateUser = await User.findOneAndUpdate(
        { username: req.params.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            role: req.body.role,
            verificationStatus: req.body.verificationStatus,
            profilePicture: req.body.profilePicture,
            deleteStatus: req.body.deleteStatus,
            deleteReason: req.body.deleteReason,
          },
        }
      );
      res.redirect("/login");
    }
  }),
];

exports.user_delete_post = asyncHandler((req, res, next) => {
  res.send("NOT IMPLEMENTED: User delete post ");
});

exports.user_sign_in = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).exec();

    if (!user) {
      return res.status(404).render("login", { errors: [{ msg: "Incorrect username" }] });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(404).render("login", { errors: [{ msg: "Incorrect password" }] });
    }

    // Set payload of the JWT with property "id" that store userId that just login recently
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400,
    }); // 24 hours

    // Save token to session
    req.session.token = token;

    // After login successful, replace session.cart with user cart data in database
    const userCart = await CartModel.find({userId: user.id});
    req.session.cart = userCart;
    return res.redirect("/books")
  } catch (error) {
    return res.status(500).render("errorPage", { errorStaus: 500, message: error.message })
  }
});

exports.user_sign_out = asyncHandler(async (req, res, next) => {
  try {
    req.session = null;
    return res.redirect(BOOK_LIST_URL);
  } catch (err) {
    this.next(err);
  }
});

exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("login", { title: "Login Page" });
})