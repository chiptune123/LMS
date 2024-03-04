const jwt = require("jsonwebtoken");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config.js");

verifyToken = asyncHandler(async (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: "No token provide" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            })
        }

        req.userID = decoded.id;
        next();
    })
})


isAdmin = asyncHandler(async (req, res, next) => {
    User.findById(req.userID).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(user.role === "Admin"){
            next();
        } else {
            res.status(403).send({ message: "Require Admin Role!"});
            return;
        }
    })
})