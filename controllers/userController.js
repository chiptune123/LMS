const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const config = require("../config/auth.config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CartModel = require("../models/carts");

const BOOK_LIST_URL = "/books";
const LOGIN_PAGE_URL = "/auth/login";
const USER_MANAGEMENT_MEMBER_URL = "/admin/dashboard/user_management/member";
const STAFF_MANAGEMENT_URL = "/admin/dashboard/user_management/staff"
const USER_MANAGEMENT_PAGE = "user_management";

// exports.user_list = asyncHandler(async (req, res, next) => {
//   const allUsers = await User.find({}, "username name email")
//     .sort({ username: 1 })
//     .exec();
//   res.render("user_list", { title: "User List", user_list: allUsers });
// });

async function getUniqueSimplifyId() {
  let currentYear = new Date().getFullYear() * 10000
  let max = currentYear + 9999;
  let randomId, user;

  let isDuplicated = false;
  // Return with the first 4 number is current year and the last 4 number is 9999

  do {
    randomId = Math.floor(Math.random() * (max - currentYear + 1)) + currentYear;
    let userDetail = await User.find({ simplifyId: randomId }).exec;

    if (userDetail) {
      isDuplicated = true;
    }

    isDuplicated = false;
  } while (isDuplicated == true);

  return randomId;
}

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
    console.log(allStaff);
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
  const userDetail = await User.findOne({ _id: req.params.id }).exec();
  console.log(userDetail);
  res.render("user_profile", { title: "Your Profile", user_detail: userDetail });
});

exports.user_create_get = asyncHandler((req, res, next) => {
  res.render("sign_up_form", { title: "Signup Page" });
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
    const bodyValidate = validationResult(req);
    let errors = [];

    const [userDetail, emailDetail] = await Promise.all([
      User.find({ username: req.body.username }).exec(),
      User.find({ email: req.body.email }).exec()
    ]);
    const [memberList, staffList] = await Promise.all([
      User.find({ role: "User" }).sort({ createdAt: 1 }).exec(),
      User.find({ role: "Librarian" }).sort({ createdAt: 1 }).exec(),
    ]);

    // If username duplicate, add error to errors object
    if (userDetail.length > 0) {
      errors.push({
        msg: "The username is already taken"
      })
    }
    if (emailDetail.length > 0) {
      errors.push({
        msg: "The email is already taken"
      })
    }

    if (!bodyValidate.isEmpty()) {
      // Create errors object

      for (let result of bodyValidate.errors) {
        errors.push(result.msg);
      }

      const inputData = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
      }
      if (res.locals.userRole == "Admin") {
        return res.render(USER_MANAGEMENT_PAGE, {
          title: "Staff Collection",
          errors_object: errors,
          user_list: staffList,
        });
      }

      return res.render("sign_up_form", {
        title: "Staff Collection",
        user: inputData,
        errors: errors.array(),
      });
    }

    let Id = await getUniqueSimplifyId();

    const newUser = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name,
      email: req.body.email,
      simplifyId: Id,
    })

    const result = await newUser.save();

    console.log(result)
    if (res.locals.userRole == "Admin") {
      res.redirect(STAFF_MANAGEMENT_URL);
    } else {
      res.redirect(LOGIN_PAGE_URL);
    }
  })
];

exports.staff_create_post = [
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
    const bodyValidate = validationResult(req);
    let errors = [];

    const [userDetail, emailDetail] = await Promise.all([
      User.find({ username: req.body.username }).exec(),
      User.find({ email: req.body.email }).exec()
    ]);
    const [memberList, staffList] = await Promise.all([
      User.find({ role: "User" }).sort({ createdAt: 1 }).exec(),
      User.find({ role: "Librarian" }).sort({ createdAt: 1 }).exec(),
    ]);

    // If username duplicate, add error to errors object
    if (userDetail.length > 0) {
      errors.push(
        "The username is already taken"
      );
    }
    if (emailDetail.length > 0) {
      errors.push(
        "The email is already taken"
      );
    }

    if (!bodyValidate.isEmpty()) {
      // Create errors object

      for (let result of bodyValidate.errors) {
        errors.push(result.msg);
      }

      return res.render(USER_MANAGEMENT_PAGE, {
        title: "Staff Collection",
        errors_object: errors,
        user_list: staffList,
      });

    }

    let Id = await getUniqueSimplifyId();

    const newUser = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      simplifyId: Id,
    })

    await newUser.save();

    res.redirect(STAFF_MANAGEMENT_URL);
  })
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
      const userInfo = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
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

      res.redirect('back');
    }
  }),
];

exports.user_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const userDetail = await User.findById(req.params.id);
    if (userDetail) {
      await User.findByIdAndDelete(req.params.id);

      res.redirect('back');
    } else {
      res.status(404).render("errorPage", { message: "User not found!", errorStatus: 404 });
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 404 });
  }
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
    const userCart = await CartModel.find({ userId: user.id });
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