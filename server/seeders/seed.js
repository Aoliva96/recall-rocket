const db = require("../config/connection");
const cleanDB = require("./cleanDB");
const { User, Card, Favorite } = require("../models");

const mongoCardSeeds = require("./mongoCardSeeds.json");
const expressCardSeeds = require("./expressCardSeeds.json");
const reactCardSeeds = require("./reactCardSeeds.json");
const nodeCardSeeds = require("./nodeCardSeeds.json");
const userSeeds = require("./userSeeds.json");
const favoriteSeeds = require("./favoriteSeeds.json");

const addFavorite = require("../utils/favorites");

db.once("open", async () => {
	try {
		await cleanDB("Favorite", "favorites");
		await cleanDB("Card", "cards");
		await cleanDB("User", "users");

		// Seed users first
		const users = await User.create(userSeeds);
		const adminUser = await User.findOne({ admin: true });

		if (!adminUser) {
			throw new Error("Admin user not found");
		}
		const adminUserId = adminUser._id;

		// Map each card seed with the admin user ID for the createdBy field
		const allCardSeeds = [
			...mongoCardSeeds,
			...expressCardSeeds,
			...reactCardSeeds,
			...nodeCardSeeds,
		].map((card) => ({
			...card,
			createdBy: adminUserId,
		}));

		// Seed cards
		const createdCards = await Card.create(allCardSeeds);

		// Seed favorites
		const createdFavorites = await Favorite.create(favoriteSeeds);

		// Assign favorites to users and cards
		for (let favoriteSeed of favoriteSeeds) {
			const { username, concept } = favoriteSeed;

			// Find the user based on the favoriteSeed's username
			const user = users.find((u) => u.username === username);
			if (!user) {
				throw new Error(`User not found for username: ${username}`);
			}

			// Find the card based on the favoriteSeed's concept
			const card = createdCards.find((c) => c.concept === concept);
			if (!card) {
				throw new Error(`Card not found for concept: ${concept}`);
			}

			// Create a new Favorite instance
			const newFavorite = await Favorite.create({
				...favoriteSeed,
				user: user._id,
				card: card._id,
			});

			// Update user's favorites
			await User.findByIdAndUpdate(user._id, {
				$push: { favorites: newFavorite._id },
			});

			// Update card's favorites
			await Card.findByIdAndUpdate(card._id, {
				$push: { favorites: newFavorite._id },
			});

			console.log(`Favorite created for user ${username} and card ${concept}`);
		}

		console.log("All data seeded successfully");
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
});
