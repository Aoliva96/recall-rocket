import React, { useState } from "react";

const UpdateForm = ({ user, onUpdate }) => {
	const [formState, setFormState] = useState({
		username: user.username || "",
		email: user.email || "",
		password: "",
	});

	const [errors, setErrors] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState({ ...formState, [name]: value });

		// Clear password and email errors when user starts typing in the respective fields
		if (name === "password") {
			setErrors({ ...errors, password: "" });
		} else if (name === "email") {
			setErrors({ ...errors, email: "" });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validateEmail(formState.email) && formState.email !== "") {
			setErrors({
				...errors,
				email: "Please enter a valid email address.",
			});
			return;
		}

		if (formState.password && !validatePassword(formState.password)) {
			setErrors({
				...errors,
				password:
					"Password must be at least 8 characters long, with at least one letter and one number.",
			});
			return;
		}

		onUpdate(formState);
	};

	const validateEmail = (email) => {
		// Basic email format validation
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const validatePassword = (password) => {
		// Password format validation
		const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&-]{8,}$/;
		return re.test(String(password));
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Username:</label>
				<input
					type="text"
					name="username"
					value={formState.username}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label>Email:</label>
				<input
					type="email"
					name="email"
					value={formState.email}
					onChange={handleChange}
				/>
				{errors.email && <p className="error">{errors.email}</p>}
			</div>
			<div>
				<label>Password:</label>
				<input
					type="password"
					name="password"
					value={formState.password}
					onChange={handleChange}
				/>
				{errors.password && <p className="error">{errors.password}</p>}
			</div>
			<button type="submit">Submit</button>
		</form>
	);
};

export default UpdateForm;
