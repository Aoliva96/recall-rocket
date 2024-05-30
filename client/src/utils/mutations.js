import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        cards {
          _id
          question
          answer
          concept
        }
        favorites {
          _id
          card {
            _id
            question
            answer
            concept
          }
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_CARD = gql`
  mutation addCard($question: String!, $answer: String!, $concept: String!) {
    addCard(question: $question, answer: $answer, concept: $concept) {
      _id
      question
      answer
      concept
    }
  }
`;

export const REMOVE_CARD = gql`
  mutation removeCard($cardId: ID!) {
    removeCard(cardId: $cardId) {
      _id
      question
      answer
      concept
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation addFavorite($cardId: ID!) {
    addFavorite(cardId: $cardId) {
      _id
      card {
        _id
        question
        answer
        concept
      }
      user {
        _id
        username
      }
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation removeFavorite($favoriteId: ID!) {
    removeFavorite(favoriteId: $favoriteId) {
      _id
      card {
        _id
        question
        answer
        concept
      }
      user {
        _id
        username
      }
    }
  }
`;
