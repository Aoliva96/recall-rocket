import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UPDATE_USER, ADD_USER_CARD, ADD_ADMIN_CARD } from "../utils/mutations";
import Auth from "../utils/auth";
import CardStack from "../components/CardStack";
import UpdateForm from "../components/UpdateForm";
import CreateCardForm from "../components/CreateCardForm";

const Profile = () => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showCreateCardForm, setShowCreateCardForm] = useState(false);
  const [cardType, setCardType] = useState(null);

  // Check device width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    // Add/remove event listener as needed
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check for token on component mount
  useEffect(() => {
    const token = Auth.getToken();
  }, []);

  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return (
      <div className="flex-row justify-center mb-4">
        <h4 className="m-5 p-5">You must be logged in to view this page.</h4>
      </div>
    );
  }

  // Fetch data for logged-in user
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  const [addUserCard] = useMutation(ADD_USER_CARD);
  const [addAdminCard] = useMutation(ADD_ADMIN_CARD);

  // If no user data, return empty object
  const user = data?.me || {};

  // Check if loading
  if (loading) {
    return <div className="w-100 text-center">Loading...</div>;
  }

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const toggleCreateCardForm = (type) => {
    setCardType(type);
    setShowCreateCardForm(!showCreateCardForm);
  };

  const handleUpdateUser = async (userData) => {
    try {
      const { data } = await updateUser({
        variables: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        },
      });

      if (data?.updateUser) {
        // Refetch user data after update
        refetch();
        // Hide update form after successful update
        setShowUpdateForm(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCreateCard = async (cardData) => {
    try {
      const mutation = cardType === "admin" ? addAdminCard : addUserCard;
      const { data } = await mutation({
        variables: {
          concept: cardData.concept,
          question: cardData.question,
          answer: cardData.answer,
        },
        update: (cache, { data: { addUserCard, addAdminCard } }) => {
          const newCard = addUserCard || addAdminCard;
          cache.writeQuery({
            query: QUERY_ME,
            data: {
              me: {
                ...user,
                cards: [...user.cards, newCard],
              },
            },
          });
        },
      });
      refetch();
      setShowCreateCardForm(false);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="card bg-white mt-2">
          <h4 className="card-header bg-primary text-white p-2 pl-3">
            Welcome to your profile page, {user.username}!
          </h4>
          <div className="card-body mx-2">
            <div className="display-flex align-center">
              <h4>User Information</h4>
            </div>
            <hr className="mb-3" />
            {/* Display user information */}
            <p>
              <span style={{ fontWeight: "bold" }}>Username:</span>{" "}
              {user.username}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Email:</span> {user.email}
            </p>
            {/* Show update form conditionally */}
            {!showUpdateForm && (
              <button
                className={
                  isDesktop
                    ? "btn btn-md btn-primary text-white mb-3 py-1"
                    : "btn btn-md btn-primary text-white mb-3 py-2 nav-btn"
                }
                onClick={toggleUpdateForm}
              >
                Update Info
              </button>
            )}
            {showUpdateForm && (
              <UpdateForm user={user} onUpdate={handleUpdateUser} />
            )}
            <h4>Your Cards</h4>
            <hr className="mb-3" />

            {user.cards.length > 0 ? (
              <div className="card-stack-container">
                <CardStack
                  cards={user.cards}
                  title="Your Cards"
                  showUsername={false}
                  userId={user._id}
                />
              </div>
            ) : (
              <div className="text-center mt-4">
                <p>You don't have any cards yet.</p>
                <p>Please create some cards to get started.</p>
              </div>
            )}
            {/* Render buttons for adding cards */}
            {!showCreateCardForm && !user.admin && (
              <button
                className={
                  isDesktop
                    ? "btn btn-md btn-primary text-white mb-3 py-1"
                    : "btn btn-md btn-primary text-white mb-3 py-2 nav-btn"
                }
                onClick={() => toggleCreateCardForm("user")}
              >
                New Card
              </button>
            )}
            {!showCreateCardForm && user.admin && (
              <button
                className={
                  isDesktop
                    ? "btn btn-sm btn-primary text-white mb-3 py-1"
                    : "btn btn-md btn-link text-black mb-3 py-2 nav-btn"
                }
                onClick={() => toggleCreateCardForm("admin")}
              >
                Admin: New Public Card
              </button>
            )}
            {showCreateCardForm && (
              <CreateCardForm
                onCreate={handleCreateCard}
                onCancel={toggleCreateCardForm}
              />
            )}
            {/* Display favorites */}
            <h4>Your Favorites</h4>
            <hr className="mb-3" />
            <div className="favorite-container">
              {user.favorites && user.favorites.length > 0 ? (
                <CardStack
                  cards={
                    user.favorites.length === 1
                      ? [user.favorites[0].card]
                      : user.favorites.map((favorite) => favorite.card)
                  }
                  title="Your Favorites"
                  showUsername={true}
                />
              ) : (
                <p>You have no favorites yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
