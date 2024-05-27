const { User, Card, Favorite } = require("../models");

async function addFavorite(userId, cardId) {
	const card = await Card.findById(cardId);
	const favorite = await Favorite.create({
		card: card._id,
		question: card.question,
		answer: card.answer,
		concept: card.concept,
		cardAuthor: card.cardAuthor,
	});

	await User.findOneAndUpdate(
		{ _id: userId },
		{ $addToSet: { favorites: favorite._id } }
	);

	return favorite;
}

module.exports = addFavorite;
