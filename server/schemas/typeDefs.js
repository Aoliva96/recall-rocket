const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    admin: Boolean
  }

  type Card {
    _id: ID
    question: String
    answer: String
    concept: String
  }

  type Favorite {
    _id: ID
    question: String
    answer: String
    concept: String
    user: ID
    card: ID
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    cards(concept: String!): [Card]
    card(cardId: ID!): Card
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addCard(question: String!, answer: String!, concept: String!): Card
    removeCard(cardId: ID!): Card
    addFavorite(cardId: ID!): Favorite
    removeFavorite(favoriteId: ID!): Favorite
  }
`;

module.exports = typeDefs;
