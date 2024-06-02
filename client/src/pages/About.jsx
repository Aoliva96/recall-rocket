import React from "react";
import ExpandableNav from "../components/ExpandableNav";
import Aster from "../assets/jessie.png";
import Kristian from "../assets/james.png";
import Keegan from "../assets/meowth.png";

const About = () => {
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
						<hr className="mb-3" />
						<p className="small">no, not that Team Rocket</p>
						<p>
							We are three full stack developers that began working together
							during an edX Bootcamp. Together we learned all about the MERN
							stack and this inspired us to create this learning tool.
						</p>
						<p>
							We built this application to help new coders polish their skills
							and to allow more experienced coders to brush up on the basics.
						</p>
						<h4>Future Development</h4>
						<hr className="mb-3" />
						<ul>
							<li>
								A rating system to allow users to assign a difficulty to a card,
								which would increase or decrease the repetition of that card's
								appreance in the stack.
							</li>
							<li>
								Allow logged-in users to view other's profiles. Allow
								non-logged-in users to view partial data on a profile.
							</li>
							<li>
								Mulitple choice quizes, that are timed, and give the user a
								score for accuracy and speed.
							</li>
							<li>A leaderboard for viewing other user's scores.</li>
							<li>Dark mode.</li>
						</ul>
					</div>
				</div>
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-white p-2 pl-3">Links</h4>
					<div className="card-body mx-2">
						<div className="profile-container">
							<img
								src={Aster}
								alt="Jessie, a white female with pink hair, from Team Rocket in the Pokemon franchise"
								className="small-image"
							/>
							<div className="profile-info">
								<h4>Aster Oliva</h4>
								<div className="profile-links">
									<a href="https://github.com/Aoliva96">GitHub</a> ||{" "}
									<a href="https://www.linkedin.com/in/aster-oliva/">
										LinkedIn
									</a>
								</div>
							</div>
						</div>
						<div className="profile-container">
							<img
								src={Kristian}
								alt="James, a white male with blue hair, from Team Rocket in the Pokemon franchise"
								className="small-image"
							/>
							<div className="profile-info">
								<h4>Kristian Wareing</h4>
								<div className="profile-links">
									<a href="https://github.com/WareingK">GitHub</a> ||{" "}
									<a href="https://www.linkedin.com/in/kristian-wareing/">
										LinkedIn
									</a>
								</div>
							</div>
						</div>
						<div className="profile-container">
							<img
								src={Keegan}
								alt="Meowth, a cat pokemon, from Team Rocket in the Pokemon franchise"
								className="small-image"
							/>
							<div className="profile-info">
								<h4>Keegan Royal-Eisenberg</h4>
								<div className="profile-links">
									<a href="https://github.com/ktetsuyama">GitHub</a> ||{" "}
									<a href="https://www.linkedin.com/in/keegan-royal-eisenberg/">
										LinkedIn
									</a>
								</div>
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
