import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import ExpandableNav from "../components/ExpandableNav";

const Login = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

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

  return (
    <>
      <div
        className={
          isDesktop
            ? "card bg-white mt-2 p-0 col-6"
            : "card bg-white mt-2 p-0 col-12"
        }
      >
        <h4 className="card-header bg-primary text-white p-2 pl-3">Login</h4>
        <div className="card-body m-2">
          {data ? (
            <div className="w-100 text-center">Loading...</div>
          ) : (
            <form onSubmit={handleFormSubmit}>
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
      {/* ExpandableNav for mobile */}
      <ExpandableNav />
    </>
  );
};

export default Login;
