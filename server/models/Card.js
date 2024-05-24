const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
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
});

const Card = model("Card", cardSchema);

module.exports = Card;
