const { User, Card, Favorite } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

// Util function to allow addFavorite to be used in mutation resolver & seeders/seed.js
// const addFavorite = require("../utils/favorites");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("cards").populate("favorites");
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .populate("cards")
        .populate("favorites");

      // Fetch seed cards
      const seedCards = await Card.find({ cardAuthor: "seed" });

      return {
        ...user.toObject(),
        cards: [...user.cards, ...seedCards],
      };
    },
    cards: async (parent, { concept }) => {
      const query = concept ? { concept } : {};
      return Card.find(query).sort({ createdAt: -1 }).populate("createdBy");
    },
    seedCards: async (parent, { concept }) => {
      return Card.find({ concept, cardAuthor: "seed" })
        .sort({ createdAt: -1 })
        .populate("createdBy");
    },
    card: async (parent, { cardId }) => {
      return Card.findById(cardId).populate("createdBy");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id })
          .populate({
            path: "cards",
            populate: { path: "createdBy" },
          })
          .populate({
            path: "favorites",
            populate: { path: "card" },
          });

        // Fetch seed cards
        const seedCards = await Card.find({ cardAuthor: "seed" });

        return {
          ...user.toObject(),
          cards: [...user.cards, ...seedCards],
        };
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    favorites: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Favorite.find(params);
    },
    favorite: async (parent, { favoriteId }) => {
      return Favorite.findById(favoriteId);
    },
    concepts: async () => {
      try {
        const uniqueConcepts = await Card.distinct("concept");
        return uniqueConcepts.map((concept) => ({
          _id: concept,
          concept,
        }));
      } catch (err) {
        console.error("Error fetching concepts:", err);
        throw err;
      }
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
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    addCard: async (parent, { question, answer, concept }, context) => {
      if (context.user) {
        const card = await Card.create({
          question,
          answer,
          concept,
          createdBy: context.user._id,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { cards: card._id } }
        );
        return card;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeCard: async (parent, { cardId }, context) => {
      if (context.user) {
        const card = await Card.findOneAndDelete({
          _id: cardId,
          createdBy: context.user._id,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { cards: card._id } }
        );
        return card;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addFavorite: async (parent, { cardId }, context) => {
      if (context.user) {
        const card = await Card.findById(cardId);
        const favorite = await Favorite.create({
          card: card._id,
          user: context.user._id,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { favorites: favorite._id } }
        );
        return favorite;
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
  User: {
    cards: async (user) => {
      return Card.find({ createdBy: user._id });
    },
    favorites: async (user) => {
      return Favorite.find({ user: user._id });
    },
  },
  Card: {
    createdBy: async (card) => {
      return User.findById(card.createdBy);
    },
  },
  Favorite: {
    card: async (favorite) => {
      return Card.findById(favorite.card);
    },
    user: async (favorite) => {
      return User.findById(favorite.user);
    },
  },
};

module.exports = resolvers;
