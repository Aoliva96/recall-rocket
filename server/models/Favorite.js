const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  concept: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
});

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
