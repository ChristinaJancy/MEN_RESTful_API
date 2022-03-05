const Joi = require('joi');

//validate register
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
}
//validate login
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
}

//logic to verify our toen (JWT)
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); //verify the token
        req.user = verified; //add user to request
        next(); //move to next middleware
    }

    catch (err) {
        res.status(400).send('Invalid token.');
    }
}


module.exports = { registerValidation, loginValidation, verifyToken };

