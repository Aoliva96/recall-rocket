import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const ExpandableNav = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const iconRef = useRef(null);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	const handleClose = () => {
		setIsExpanded(false);
	};

	const logout = async (event) => {
		event.preventDefault();
		await Auth.logout();
		handleClose();
	};

	// Reference code for animated icon
	// https://www.w3schools.com/howto/howto_css_menu_icon.asp

	useEffect(() => {
		if (isExpanded) {
			iconRef.current.classList.add("change");
		} else {
			iconRef.current.classList.remove("change");
		}
	}, [isExpanded]);

	return (
		<div className={`expandable-nav ${isExpanded ? "expanded" : ""}`}>
			<div ref={iconRef} className="expand-nav-btn" onClick={handleToggle}>
				<div className="nav-icon-container">
					<div className="bar1"></div>
					<div className="bar2"></div>
					<div className="bar3"></div>
				</div>
			</div>
			<h4 className="nav-title">Menu</h4>
			{isExpanded && (
				<div className="nav-links">
					{Auth.loggedIn() ? (
						<>
							<Link className="nav-btn" to="/me" onClick={handleClose}>
								Profile
							</Link>
							<Link className="nav-btn" to="/about" onClick={handleClose}>
								About
							</Link>
							<Link className="nav-btn" onClick={logout}>
								Logout
							</Link>
						</>
					) : (
						<>
							<Link className="nav-btn" to="/login" onClick={handleClose}>
								Login
							</Link>
							<Link className="nav-btn" to="/signup" onClick={handleClose}>
								Signup
							</Link>
							<Link className="nav-btn" to="/about" onClick={handleClose}>
								About
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default ExpandableNav;
