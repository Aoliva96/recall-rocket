import decode from "jwt-decode";

class AuthService {
	getProfile() {
		const token = this.getToken();
		if (!token) return null;
		try {
			return decode(token);
		} catch (error) {
			console.error("Error decoding token:", error);
			this.logout(); // Logout user if token is invalid
			return null;
		}
	}

	loggedIn() {
		const token = this.getToken();
		return token && !this.isTokenExpired(token);
	}

	isTokenExpired(token) {
		try {
			const decoded = decode(token);
			if (!decoded.exp) return false; // No expiration time means token doesn't expire
			return decoded.exp < Date.now() / 1000;
		} catch (error) {
			console.error("Error decoding token:", error);
			return true;
		}
	}

	getToken() {
		return localStorage.getItem("id_token");
	}

	login(idToken) {
		localStorage.setItem("id_token", idToken);
		window.location.assign("/");
	}

	logout() {
		localStorage.removeItem("id_token");
		window.location.reload();
	}
}

export default new AuthService();
