const jwt = require("jsonwebtoken");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config.js");

// This function verify JWT token and set the request object with userID field.
exports.verifyToken = asyncHandler(async (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: "No token provide" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        // if (err) {
        //     return res.status(401).send({
        //         message: "Unauthorized!",
        //     })
        // }

        // set request object with tokenUserId properties for the verify middleware chain
        // decoded.id is the JWT payload properties that store userId in user_sign_in controller
        req.session.tokenUserId = decoded.id;
        console.log(decoded);
        next();
    })
})


exports.isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.session.tokenUserId).exec();

        if (user.role === "Admin") {
            next();
        } else {
            res.status(403).send({ message: "Require Admin Role!" });
        }
    } catch (err) {
        res.status(500).send({ message: err });
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
