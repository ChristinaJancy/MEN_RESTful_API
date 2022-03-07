const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//gameschema for game collection in mongodb
let gameSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 4, maxlength: 50 }, //required, minlength, maxlength
    description: { type: String, required: true }, //description is required
    price: { type: Number, required: true }, //number
    inStock: { type: Boolean, required: true }, //boolean
    image: { type: String, required: true }, //url
    category: { type: String, required: true } //action, adventure, strategy, etc.
  }
);
gameSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (update.__v != null) { 
    delete update.__v; 
  }
  const keys = ['$set', '$setOnInsert']; // keys to be updated in mongodb
  for (const key of keys) { // loop through keys
    if (update[key] != null && update[key].__v != null) {  // if version is not null then increment it by 1
      delete update[key].__v;  // delete version from update
      if (Object.keys(update[key]).length === 0) { // if object is empty then delete it
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {}; // if $inc is not present then create it
  update.$inc.__v = 1; // increment version by 1 
});


module.exports = mongoose.model("game", gameSchema); //export game model