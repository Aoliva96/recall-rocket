import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
			{error.status === 404 && (
				<div>
					<img
						src="../../public/404NotFound.png"
						alt="404 Not Found"
						style={{ maxWidth: "100%", height: "auto" }}
					/>
				</div>
			)}
		</div>
	);
}
