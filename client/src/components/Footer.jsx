import { Link } from "react-router-dom";
import ExpandableNav from "../components/ExpandableNav";

const Footer = () => {
	return (
		<footer className="w-100 mt-5 mb-2 bg-white">
			<div className="padding">
				<div className="container col-12 display-flex justify-space-between my-5 px-5">
					<div
						className="col-6 text-left py-2"
						style={{ borderRight: "1px solid black", fontStyle: "italic" }}
					>
						<p>
							Project created in May 2024 by{" "}
							<span style={{ fontWeight: "bold" }}>
								<Link to="/about">Team Rocket!</Link>
							</span>
						</p>
						<p>
							<Link to="https://github.com/Aoliva96">Aster O.</Link>
							{"  "}&#128640;{"  "}
							<Link to="https://github.com/ktetsuyama">Keegan R.E.</Link>
							{"  "}&#128640;{"  "}
							<Link to="https://github.com/WareingK">Kristian W.</Link>
						</p>
					</div>
					<div
						className="col-6 text-right py-2"
						style={{ fontStyle: "italic" }}
					>
						<p>
							<span style={{ fontWeight: "bold" }}>
								<Link to="https://github.com/Aoliva96/recall-rocket">
									Click here
								</Link>
							</span>{" "}
							to view our source code repo on GitHub!
						</p>
						<p>
							RecallRocket utilizes the{" "}
							<span>
								<Link to="https://opensource.org/license/mit">
									standard MIT License
								</Link>
							</span>
						</p>
					</div>
				</div>
			</div>
			{/* ExpandableNav for mobile */}
			<ExpandableNav />
		</footer>
	);
};

export default Footer;
