import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="card bg-white mt-2 w-50">
      <h4 className="card-header bg-primary text-white p-2 pl-3">Sign Up</h4>
      <div className="card-body m-2">
        {data ? (
          <h1 className="m-5 p-5">&#10004;</h1>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <input
              className="form-input mt-3"
              placeholder="Your username"
              name="username"
              type="text"
              value={formState.name}
              onChange={handleChange}
            />
            <input
              className="form-input mt-3"
              placeholder="Your email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
            />
            <input
              className="form-input mt-3"
              placeholder="******"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
            />
            <button
              className="btn btn-block btn-primary mt-3"
              style={{ cursor: "pointer" }}
              type="submit"
            >
              Submit
            </button>
          </form>
        )}

        {error && (
          <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
        )}
      </div>
    </div>
  );
};

export default Signup;
