const db = require("../config/connection");
const {
  User,
  MongoCard,
  ExpressCard,
  ReactCard,
  NodeCard,
} = require("../models");
const cleanDB = require("./cleanDB");
const mongoCardSeeds = require("./mongoCardSeeds.json");
const expressCardSeeds = require("./expressCardSeeds.json");
const reactCardSeeds = require("./reactCardSeeds.json");
const nodeCardSeeds = require("./nodeCardSeeds.json");
const userSeeds = require("./userSeeds.json");

db.once("open", async () => {
  try {
    await cleanDB("MongoCard", "mongoCards");
    await cleanDB("ExpressCard", "expressCards");
    await cleanDB("ReactCard", "reactCards");
    await cleanDB("NodeCard", "nodeCards");
    await cleanDB("User", "users");

    await MongoCard.create(mongoCardSeeds);
    await ExpressCard.create(expressCardSeeds);
    await ReactCard.create(reactCardSeeds);
    await NodeCard.create(nodeCardSeeds);
    await User.create(userSeeds);

    // Commented code may not be needed for this project
    // =================================================

    // for (let i = 0; i < thoughtSeeds.length; i++) {
    //   const { _id, thoughtAuthor } = await Thought.create(thoughtSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: thoughtAuthor },
    //     {
    //       $addToSet: {
    //         thoughts: _id,
    //       },
    //     }
    //   );
    // }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Data seeded successfully");
  process.exit(0);
});
