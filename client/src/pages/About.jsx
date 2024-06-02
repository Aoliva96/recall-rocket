import { React, useEffect, useState } from "react";
import ExpandableNav from "../components/ExpandableNav";
import Aster from "../assets/jessie.png";
import Kristian from "../assets/james.png";
import Keegan from "../assets/meowth.png";

const About = () => {
	// Check device width
	const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
	const [isTablet, setIsTablet] = useState(
		window.innerWidth > 768 && window.innerWidth < 992
	);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth > 992);
			setIsTablet(window.innerWidth > 768 && window.innerWidth < 992);
			setIsMobile(window.innerWidth < 768);
		};

		// Add/remove event listener as needed
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<div className="col-12 col-lg-10">
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-white p-2 pl-3">
						About us
					</h4>
					<div className="card-body mx-2">
						<div className="display-flex align-center">
							<h4>We are Team Rocket!</h4>
						</div>
						<h7>No, not that Team Rocket...</h7>
						<hr className="mb-3" />
						<p>
							We are a team of three developers that began working together
							during an EdX Bootcamp course. Together, we learned the skills
							needed to create versatile and stylish full-stack web applications
							following current industry standards. We are excited to present
							our final project for the course, RecallRocket!
						</p>
						<p>
							We created this application intending it to be a useful tool for
							new developers to develop their MERN stack skills, and to allow
							more experienced coders to brush up on the basics as well. We hope
							you enjoy using RecallRocket as much as we enjoyed creating it!
							See below for a list of features that we would like to add in the
							future.
						</p>
						<h4>Future Development</h4>
						<hr className="mb-3" />
						<ul>
							<li>
								A rating system allowing users to assign a difficulty to a card,
								which would increase or decrease the repetition of that card's
								appearance in the stack as desired.
							</li>
							<li>
								Allow logged-in users to view each other's public profiles,
								share created cards, and view average card ratings.
							</li>
							<li>
								Multiple choice timed quizzes for each MERN concept that would
								provide users a score for both accuracy and speed.
							</li>
							<li>
								A leaderboard for viewing other user's scores. Users would have
								the choice whether to submit their scores or not after
								completing a quiz.
							</li>
							<li>
								A dark/light mode switching feature to change the site theme.
							</li>
						</ul>
					</div>
				</div>
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-white p-2 pl-3">Links</h4>
					<div className="card-body mx-2">
						<div className="profile-container mt-1">
							<img
								src={Aster}
								alt="Profile picture of Aster Oliva"
								className="small-image"
								style={{
									outline: "4px solid #2d3e50",
									border: "2px solid orange",
									borderRadius: "50%",
								}}
							/>
							<div className="profile-info w-75">
								<h4>Aster Oliva</h4>
							</div>
							<div
								className={
									isDesktop
										? "profile-links w-25"
										: isTablet
										? "profile-links w-25"
										: "profile-links w-50"
								}
							>
								<a
									href="https://github.com/Aoliva96"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-github w-100"
								>
									GitHub
								</a>
								<a
									href="https://www.linkedin.com/in/aster-oliva/"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-linkedin w-100"
								>
									LinkedIn
								</a>
							</div>
						</div>
						<hr className="my-5" />
						<div className="profile-container">
							<img
								src={Kristian}
								alt="Profile picture of Kristian Wareing"
								className="small-image"
								style={{
									outline: "4px solid #2d3e50",
									border: "2px solid orange",
									borderRadius: "50%",
								}}
							/>
							<div className="profile-info w-75">
								<h4>Kristian Wareing</h4>
							</div>
							<div
								className={
									isDesktop
										? "profile-links w-25"
										: isTablet
										? "profile-links w-25"
										: "profile-links w-50"
								}
							>
								<a
									href="https://github.com/WareingK"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-github w-100"
								>
									GitHub
								</a>
								<a
									href="https://www.linkedin.com/in/kristian-wareing/"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-linkedin w-100"
								>
									LinkedIn
								</a>
							</div>
						</div>
						<hr className="my-5" />
						<div className="profile-container">
							<img
								src={Keegan}
								alt="Profile picture for Keegan Royal-Eisenberg"
								className="small-image"
								style={{
									outline: "4px solid #2d3e50",
									border: "2px solid orange",
									borderRadius: "50%",
								}}
							/>
							<div className="profile-info w-75">
								<h4>Keegan Royal-Eisenberg</h4>
							</div>
							<div
								className={
									isDesktop
										? "profile-links w-25"
										: isTablet
										? "profile-links w-25"
										: "profile-links w-50"
								}
							>
								<a
									href="https://github.com/ktetsuyama"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-github w-100"
								>
									GitHub
								</a>
								<a
									href="https://www.linkedin.com/in/keegan-royal-eisenberg/"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-linkedin w-100"
								>
									LinkedIn
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* ExpandableNav for mobile */}
			<ExpandableNav />
		</>
	);
};

export default About;
