import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

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

<<<<<<< HEAD
  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
=======
	// submit form
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await login({
				variables: { ...formState },
			});
>>>>>>> 28b3e95 (Working on connecting back with front.)

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

	return (
		<div className="card bg-white mt-2 w-50">
			<h4 className="card-header bg-primary text-white p-2 pl-3">Login</h4>
			<div className="card-body m-2">
				{data ? (
					<h1 className="m-5 p-5">&#10004;</h1>
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
	);
};

export default Login;
