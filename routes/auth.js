const router = require('express').Router();
const User = require('../models/user');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { application } = require('express');

// //registration 
router.post("/register", async (req, res) => {
    //validate data 
    const { error } = registerValidation(req.body);
    //if error return 400 - bad request
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const emailExist = await User.findOne({ email: req.body.email });
    //if email exist return 400 - bad request
    if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);


    //create a new user and save to db
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt)
    });
    try {
        const savedUser = await user.save();
        res.json({ error: null, data: savedUser._id });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});
//end of register route


// login

router.post("/login", async (req, res) => {
    //validate data 
    const { error } = loginValidation(req.body);
    //if error return 400 - bad request
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    //check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ error: "Email or password is incorrect" });
    }

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).json({ error: "Email or password is incorrect" });
    }

    //create and assign a token
    const token = jwt.sign(
        {
            name: user.name,
            email: user.email
        },
      
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.header("auth-token", token).json({
        error: null,
        token: token,
    });

});
module.exports = router;
