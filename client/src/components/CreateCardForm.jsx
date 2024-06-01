import React, { useState } from "react";

const CreateCardForm = ({ onCreate, onCancel }) => {
	const [formState, setFormState] = useState({
		concept: "",
		question: "",
		answer: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState({ ...formState, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};

		if (formState.concept.trim() === "") {
			newErrors.concept = "Please enter a concept.";
		}

		if (formState.question.trim() === "") {
			newErrors.question = "Please enter a question.";
		}

		if (formState.answer.trim() === "") {
			newErrors.answer = "Please enter an answer.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onCreate(formState);
	};

	return (
		<div className="form-container card w-50">
			<h4 className="card-header bg-primary text-white p-2 pl-3">
				Create a New Card
			</h4>
			<form className="card-body px-3" onSubmit={handleSubmit}>
				<div className="form-fields">
					<label>Concept:</label>
					<input
						type="text"
						name="concept"
						value={formState.concept}
						onChange={handleChange}
					/>
					{errors.concept && <p className="error-text">{errors.concept}</p>}
				</div>
				<div className="form-fields">
					<label>Question:</label>
					<input
						type="text"
						name="question"
						value={formState.question}
						onChange={handleChange}
					/>
					{errors.question && <p className="error-text">{errors.question}</p>}
				</div>
				<div className="form-fields">
					<label>Answer:</label>
					<input
						type="text"
						name="answer"
						value={formState.answer}
						onChange={handleChange}
					/>
					{errors.answer && <p className="error-text">{errors.answer}</p>}
				</div>
				<button
					type="submit"
					className="btn btn-md btn-primary text-white mt-3 mb-1 nav-btn w-100"
				>
					Submit
				</button>
				<button
					type="button"
					className="btn btn-md btn-danger text-white mt-1 mb-2 nav-btn w-100"
					onClick={onCancel}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default CreateCardForm;
