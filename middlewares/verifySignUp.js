const User = require("../models/users");
const asyncHandler = require('express-async-handler');

checkDuplicateUsernameOrEmail = asyncHandler(async (req, res, next) => {
    // User duplicate check
    await User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Username is exist!" });
            return;
        }
    })


    // Email duplicate check
    await User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is exist!" });
            return;
        }
    })

    next();
});

const verifySignUp = {
    checkDuplicateUsernameOrEmail
}

module.exports = verifySignUp;