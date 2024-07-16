const jwt = require("jsonwebtoken");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config.js");

// Import Users model
const userModel = require("../models/users.js");

// This function verify JWT token and decode the payload to get userId
exports.verifyToken = asyncHandler(async (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return next();
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        // If token expired, Empty session and pass to next middlewares
        if (err) {
            if (err.name == "TokenExpiredError") {
                req.session = null;
                return next();
            }
        }
        // set request object with tokenUserId properties for the verify middleware chain
        // decoded.id is the JWT payload properties that store userId in user_sign_in controller
        req.session.tokenUserId = decoded.id;
    });

    // Query user with tokenUserId from the token and set res.locals variable accessible in templates
    const userDetail = await userModel.findById(req.session.tokenUserId).exec();
    res.locals.userRole = userDetail.role;
    res.locals.tokenUserId = req.session.tokenUserId;

    next();
})


exports.isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.session.tokenUserId).exec();

        if (user) {
            if (user.role === "Admin") {
                next();
            } else {
                res.status(403).render("errorPage", { message: "Require Admin Role!", errorStatus: 403 });
            }
        } else {
            res.status(403).render("errorPage", { message: "Please login to use this feature!", errorStatus: 403 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
        return;
    }

    // User.findById(req.userID).exec((err, user) => {
    //     if (err) {
    //         res.status(500).send({ message: err });
    //         return;
    //     }

    //     if (user.role === "Admin") {
    //         next();
    //     } else {
    //         res.status(403).send({ message: "Require Admin Role!" });
    //         return;
    //     }
    // })
})

exports.isLibrarian = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.session.tokenUserId).exec();

        if (user.role === "Librarian") {
            next();
        } else {
            res.status(403).send({ message: "Require Librarian Role!" });
        }
    } catch (err) {
        res.status(500).send({ message: err });
    }

    // User.findById(req.userID).exec((err, user) => {
    //     if (err) {
    //         res.status(500).send({ message: err });
    //         return;
    //     }

    //     if (user.role === "Librarian") {
    //         next();
    //     } else {
    //         res.status(403).send({ message: "Require Librarian Role!" });
    //         return;
    //     }
    // })
})

exports.isAdminOrLibrarian = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.session.tokenUserId).exec();

        if (user.role === "Admin" | user.role === "Librarian") {
            next();
        } else {
            res.status(403).send({ message: "Restrictive page for Admin or Librarian" });
        }
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    }

})
