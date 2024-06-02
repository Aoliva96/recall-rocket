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
    favorites: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const user = await User.findById(context.user._id).populate({
        path: "favorites",
        populate: {
          path: "card",
        },
      });

      return user.favorites;
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
    updateUser: async (parent, { username, email, password }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $set: updateData },
        { new: true }
      );

      const token = signToken(user);
      return { token, user };
    },
    addAdminCard: async (parent, { question, answer, concept }, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const cards = await Card.find().populate("createdBy");

      // Verify that the user has admin privileges
      const user = await User.findById(context.user._id);
      if (!user || !user.admin) {
        throw new Error(
          "You do not have the necessary permissions to perform this action!"
        );
      }

      // Create the card
      const card = await Card.create({
        question,
        answer,
        concept,
        cardAuthor: "seed",
        createdBy: context.user._id,
      });

      // Update the user's cards
      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { cards: card._id } }
      );

      return card;
    },
    updateAdminCard: async (
      parent,
      { cardId, question, answer, concept },
      context
    ) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Verify that the user has admin privileges
      const user = await User.findById(context.user._id);
      if (!user || !user.admin) {
        // Assuming there is an isAdmin field in the User model
        throw new Error("You must be an admin to do this");
      }

      // Check if the card exists
      const card = await Card.findById(cardId);
      if (!card) {
        throw new Error(`Card with ID ${cardId} not found`);
      }

      // Update the card
      card.question = question;
      card.answer = answer;
      card.concept = concept;
      const updatedCard = await card.save();

      return updatedCard;
    },
    removeAdminCard: async (parent, { cardId }, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Verify that the user has admin privileges
      const user = await User.findById(context.user._id);
      if (!user || !user.admin) {
        throw new Error("You must be an admin to do this");
      }

      try {
        // Find the card and ensure it was authored by the current user
        const card = await Card.findOneAndDelete({
          _id: cardId,
          createdBy: context.user._id,
        });

        if (!card) {
          throw new UserInputError(
            `Card with ID ${cardId} not found or you do not have permission to delete it`
          );
        }

        // Remove the card reference from the user's list of cards
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { cards: card._id } }
        );

        return card;
      } catch (error) {
        throw new Error(`Failed to delete card: ${error.message}`);
      }
    },
    addUserCard: async (parent, { question, answer, concept }, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const cards = await Card.find().populate("createdBy");

      // Create the card
      const card = await Card.create({
        question,
        answer,
        concept,
        cardAuthor: context.user.username,
        createdBy: context.user._id,
      });

      // Update the user's cards
      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { cards: card._id } }
      );

      return card;
    },
    updateUserCard: async (
      parent,
      { cardId, question, answer, concept },
      context
    ) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Check if the card exists
      const card = await Card.findById(cardId);
      if (!card) {
        throw new Error(`Card with ID ${cardId} not found`);
      }

      // Update the card
      card.question = question;
      card.answer = answer;
      card.concept = concept;
      const updatedCard = await card.save();

      return updatedCard;
    },
    removeUserCard: async (parent, { cardId }, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        // Find the card and ensure it was authored by the current user
        const card = await Card.findOneAndDelete({
          _id: cardId,
          createdBy: context.user._id,
        });

        if (!card) {
          throw new UserInputError(
            `Card with ID ${cardId} not found or you do not have permission to delete it`
          );
        }

        // Remove the card reference from the user's list of cards
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { cards: card._id } }
        );

        return card;
      } catch (error) {
        throw new Error(`Failed to delete card: ${error.message}`);
      }
    },
    addFavorite: async (parent, { cardId }, context) => {
      if (context.user) {
        const card = await Card.findById(cardId);
        const favorite = await Favorite.create({
          card: card._id,
          user: context.user._id,
          question: card.question,
          answer: card.answer,
          concept: card.concept,
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
