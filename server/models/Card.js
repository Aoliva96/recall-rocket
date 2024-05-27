const { Schema, model } = require("mongoose");

const cardSchema = new Schema(
	{
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
		cardAuthor: {
			type: String,
			default: "seed", // Indicates this is a seed card
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

const Card = model("Card", cardSchema);

module.exports = Card;
