export const authEndpoint = "https://accounts.spotify.com/authorize?"

export const clientID = "91565f2b50cf458cae7ecf5434cf44e2"
export const redirectURI = "http://localhost:3000/callback/"
export const scopes = [
    'streaming',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-playback-state',
    "user-read-email",

];


// export default function() {
//     let token = window.location.hash.substr(1);
//     if (token) {
//         const o = Object.fromEntries(new URLSearchParams(token));
//         return o.access_token;
//     } else {
//         // If there is no token, redirect to Spotify authorization
//         redirectToSpotifyAuthentication();
//     }
// }

// function redirectToSpotifyAuthentication() {
//     const authEndpoint = 'https://accounts.spotify.com/authorize';
//     const clientId = '91565f2b50cf458cae7ecf5434cf44e2';
//     const redirectUri = `${window.location.protocol}//${window.location.host}/`;
//     let query = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`;
//     window.location = `${authEndpoint}?${query}`;
// }