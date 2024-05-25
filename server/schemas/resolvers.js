const { User, Card, Favorite } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

// Util function to allow addFavorite to be used in mutation resolver & seeders/seed.js
const addFavorite = require("../utils/favorites");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("favorites");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("favorites");
    },
    favorites: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Favorite.aggregate([
        { $match: params },
        { $sample: { size: await Favorite.countDocuments(params) } },
      ]);
    },
    favorite: async (parent, { favoriteId }) => {
      return Favorite.findOne({ _id: favoriteId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("favorites");
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addCard: async (parent, args, context) => {
      if (context.user && context.user.admin) {
        const card = await Card.create(args);
        return card;
      } else {
        throw new AuthenticationError(
          "Admin permissions required to perform this action."
        );
      }
    },
    removeCard: async (parent, { cardId }, context) => {
      if (context.user && context.user.admin) {
        const card = await Card.findOneAndDelete({ _id: cardId });
        return card;
      } else {
        throw new AuthenticationError(
          "Admin permissions required to perform this action."
        );
      }
    },
    addFavorite: async (parent, { cardId }, context) => {
      if (context.user) {
        return addFavorite(context.user._id, cardId);
        // If seeding favorites with an exterior util function is causing issues, comment function above and uncomment below

        // const card = await Card.findById(cardId);
        // const favorite = await Favorite.create({
        //   card: card._id,
        //   question: card.question,
        //   answer: card.answer,
        //   concept: card.concept,
        //   user: context.user._id,
        // });

        // await User.findOneAndUpdate(
        //   { _id: context.user._id },
        //   { $addToSet: { favorites: favorite._id } }
        // );

        // return favorite;
      }
      throw new AuthenticationError("Please log in to perform this action.");
    },
    removeFavorite: async (parent, { favoriteId }, context) => {
      if (context.user) {
        const favorite = await Favorite.findOneAndDelete({
          _id: favoriteId,
          user: context.user._id,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favorites: favorite._id } }
        );

        return favorite;
      }
      throw new AuthenticationError("Please log in to perform this action.");
    },
  },
};

module.exports = resolvers;
