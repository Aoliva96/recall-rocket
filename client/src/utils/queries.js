import { gql } from "@apollo/client";

export const QUERY_ME = gql`
	query me {
		me {
			_id
			username
			email
			cards {
				_id
				question
				answer
				concept
				cardAuthor
				createdBy {
					_id
					username
				}
			}
			admin
			favorites {
				_id
				card {
					_id
					question
					answer
					concept
					cardAuthor
					createdBy {
						_id
						username
					}
				}
			}
		}
	}
`;

export const QUERY_USER = gql`
	query user($username: String!) {
		user(username: $username) {
			_id
			username
			email
			cards {
				_id
				question
				answer
				concept
				cardAuthor
				createdBy {
					_id
					username
				}
			}
			admin
			favorites {
				_id
				card {
					_id
					question
					answer
					concept
					cardAuthor
					createdBy {
						_id
						username
					}
				}
			}
		}
	}
`;

export const QUERY_CARDS = gql`
	query GetCards($concept: String!) {
		cards(concept: $concept) {
			_id
			question
			answer
			concept
			cardAuthor
			createdAt
			createdBy {
				_id
				username
			}
		}
	}
`;

export const QUERY_SINGLE_CARD = gql`
	query getCard($id: ID!) {
		card(id: $id) {
			_id
			question
			answer
			concept
			cardAuthor
		}
	}
`;
export const QUERY_SEED_CARDS = gql`
	query getSeedCards($concept: String!) {
		seedCards(concept: $concept) {
			_id
			question
			answer
			concept
			cardAuthor
			createdBy {
				username
			}
		}
	}
`;

export const QUERY_CONCEPTS = gql`
	query GetConcepts {
		concepts {
			_id
			concept
		}
	}
`;
