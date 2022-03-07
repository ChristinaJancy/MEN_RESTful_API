const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let gameSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 4, maxlength: 50 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
  }
);

gameSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

// Export the model
module.exports = mongoose.model("game", gameSchema);