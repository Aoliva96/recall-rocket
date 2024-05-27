const typeDefs = `
	type User {
		_id: ID!
		username: String!
		email: String!
		cards: [Card]!
		favorites: [Favorite]!
	}

	type Card {
		_id: ID!
		question: String!
		answer: String!
		concept: String!
		cardAuthor: String!
		createdAt: String!
		createdBy: User
	}

	type Favorite {
		_id: ID!
		card: Card!
		user: User!
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		users: [User]
		user(username: String!): User
		cards(concept: String): [Card]
		seedCards(concept: String!): [Card]
		card(cardId: ID!): Card
		me: User
		favorites(username: String): [Favorite]
		favorite(favoriteId: ID!): Favorite
		concepts: [Concept]
	}

	type Concept {
		_id: ID!
		concept: String!
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
