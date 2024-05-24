const db = require("../config/connection");
const cleanDB = require("./cleanDB");
const { User, Card, Favorite } = require("../models");

const mongoCardSeeds = require("./mongoCardSeeds.json");
const expressCardSeeds = require("./expressCardSeeds.json");
const reactCardSeeds = require("./reactCardSeeds.json");
const nodeCardSeeds = require("./nodeCardSeeds.json");
const userSeeds = require("./userSeeds.json");
// const favoriteSeeds = require("./favoriteSeeds.json");

// If seeding favorites with an exterior util function is causing issues, comment addFavorite function below and uncomment commented code below

const addFavorite = require("../utils/favorites");

db.once("open", async () => {
  try {
    await cleanDB("Favorite", "favorites");
    await cleanDB("Card", "cards");
    await cleanDB("User", "users");

    // Seed favorites with addFavorite function
    const users = await User.create(userSeeds);
    const cards = await Card.create([
      ...mongoCardSeeds,
      ...expressCardSeeds,
      ...reactCardSeeds,
      ...nodeCardSeeds,
    ]);

    for (let user of users) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      await addFavorite(null, randomCard._id, { user });
    }

    // Seed cards & users with JSON data
    // await Card.create(mongoCardSeeds);
    // await Card.create(expressCardSeeds);
    // await Card.create(reactCardSeeds);
    // await Card.create(nodeCardSeeds);
    // await User.create(userSeeds);

    // Seed favorites & assign to users with JSON data
    // for (let i = 0; i < favoriteSeeds.length; i++) {
    //   const { _id, user } = await Favorite.create(favoriteSeeds[i]);
    //   await User.findOneAndUpdate(
    //     { username: user },
    //     {
    //       $addToSet: {
    //         favorites: _id,
    //       },
    //     }
    //   );
    // }

    console.log("All data seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
