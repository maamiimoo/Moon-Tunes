export const authEndpoint = "https://accounts.spotify.com/authorize";
// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "91565f2b50cf458cae7ecf5434cf44e2";
export const redirectUri = "http://localhost:3000/callback/";
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];


export default function() {
    let token = window.location.hash.substr(1);
    if (token) {
        const o = Object.fromEntries(new URLSearchParams(token));
        return o.access_token;
    } else {
        // If there is no token, redirect to Spotify authorization
        redirectToSpotifyAuthentication();
    }
}

function redirectToSpotifyAuthentication() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = '91565f2b50cf458cae7ecf5434cf44e2';
    const redirectUri = `${window.location.protocol}//${window.location.host}/`;
    let query = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`;
    window.location = `${authEndpoint}?${query}`;
}