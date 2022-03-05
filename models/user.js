const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        email: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        dateOfCreation: {
            type: Date,
            default: Date.now
        }
    }
    // name 
    // email
    // password
    // date of creation 
);

// Export the model
module.exports = mongoose.model("user", userSchema);