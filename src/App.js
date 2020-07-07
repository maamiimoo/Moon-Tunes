// import React, { Component } from "react";
// import * as $ from "jquery";
// import { authEndpoint, clientID, redirectURI, scopes } from "./user-config";
// import hash from "./hash";
// import Player from "./Player";
// // this is the react logo  import logo from "./logo.svg";
// import "./App.css";
// // import Aqua from "./imgs/aqua.png";




// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       token: null,
//       item: {
//         album: {
//           images: [{ url: "" }]
//         },
//         name: "",
//         artists: [{ name: "" }],
//         duration_ms: 0
//       },
//       is_playing: "Paused",
//       progress_ms: 0,
//       no_data: false,
//     };

//     this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
//     this.tick = this.tick.bind(this);
//   }



//   componentDidMount() {
//     // Set token
//     let _token = hash.access_token;

//     if (_token) {
//       // Set token
//       this.setState({
//         token: _token
//       });
//       this.getCurrentlyPlaying(_token);
//     }

//     // set interval for polling every 5 seconds
//     this.interval = setInterval(() => this.tick(), 5000);
//   }

//   componentWillUnmount() {
//     // clear the interval to save resources
//     clearInterval(this.interval);
//   }

//   tick() {
//     if(this.state.token) {
//       this.getCurrentlyPlaying(this.state.token);
//     }
//   }


//   getCurrentlyPlaying(token) {
//     // Make a call using the token
//     $.ajax({
//       url: "https://api.spotify.com/v1/me/player",
//       type: "GET",
//       beforeSend: xhr => {
//         xhr.setRequestHeader("Authorization", "Bearer " + token);
//       },
//       success: data => {
//         // Checks if the data is not empty
//         if(!data) {
//           this.setState({
//             no_data: true,
//           });
//           return;
//         }

//         this.setState({
//           item: data.item,
//           is_playing: data.is_playing,
//           progress_ms: data.progress_ms,
//           no_data: false /* We need to "reset" the boolean, in case the
//                             user does not give F5 and has opened his Spotify. */
//         });
//       }
//     });
//   }

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           {/* landing page here, user's will be redirected to login. add logo  */}
//           {/* <img src={logo} className="App-logo" alt="logo" /> */}

//           {!this.state.token && (
//             <a
//               className="btn btn--loginApp-link"
//               href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
//                 "%20"
//               )}&response_type=token&show_dialog=true`}
//             >
//               Login to Spotify
//             </a>
//           )}
//           {this.state.token && !this.state.no_data && (
//             <Player
//               item={this.state.item}
//               is_playing={this.state.is_playing}
//               progress_ms={this.state.progress_ms}
//             />
//           )}
//           {this.state.no_data && (
//             <p>
//               {/* <img src={Aqua} className="Zodiac-Pic" alt="Aquarius" /> */}
//               please select your sign 

//             </p>
//           )}
//         </header>
//       </div>
//     );
//   }
// }

// export default App;
import React, { Component } from 'react';
import hash from './hash';
import { authEndpoint, clientID, redirectURI, scopes } from "./user-config";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      deviceId: "",
      error: "",
      trackName: "Loading...",
      artistName: "Loading...",
      albumName: "Loading...",
      playing: false,
      albumArt: "",
      sign: "",
    };
    this.playerCheckInterval = null;
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.setState({
        token: _token
      });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
      console.log(this.state.token);
    }
  }

  checkForPlayer() {
    const { token, sign } = this.state;
    if (window.Spotify !== null && sign) {
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Song Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();

      this.player.connect();
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {console.error(e);});
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    this.player.on('player_state_changed', state => this.onStateChanged(state));

    this.player.on('ready', async data => {
      let { device_id } = data;
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere()
    });
  }

  onStateChanged(state) {
    if (state !== null) {
      const {
        current_track: currentTrack,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const albumArt = currentTrack.album.images[0].url;
      const artistName = currentTrack.artists
          .map(artist => artist.name)
          .join(", ");
      const playing = !state.paused;
      this.setState({
        trackName,
        albumName,
        artistName,
        playing,
        albumArt,
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
  }

  transferPlaybackHere() {
    const { deviceId, token, sign} = this.state;
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "context_uri": sign}),
    });
  }

  handleChange(event) {
    if (event.target.value === "capricorn") {
      this.setState({sign: "spotify:playlist:37i9dQZF1DXdPec7aLTmlC"}); //capricorn Hits Playlist
    } else if (event.target.value === "aries") {
      this.setState({sign: "spotify:playlist:37i9dQZF1DX3YSRoSdA634"}); //aries Sucks Playlist
    } else {
      this.setState({sign: "spotify:playlist:37i9dQZF1DX3ND264N08pv"}); //Rage Beats Playlist
    }
  }

  render() {
    const {
      token,
      error,
      trackName,
      artistName,
      albumName,
      playing,
      albumArt,
      sign,
    } = this.state;

    return (
        <div className="App">
          {error && <p>You have an error! : {error}</p> }
          <div className="Web-header">
            Moon Tunes
          </div>
          {(!sign && token) && (
              <form>
                <div className={"label"}><br/>Select your sign</div><br/>
                <input type="button" className={"sign"} value={"Aires"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Tarus"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Gemini"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Cancer"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Leo"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Virgo"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Libra"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Scopio"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Sagittarius"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Capricorn"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Aquarius"} onClick={this.handleChange}/><br/><br/>
                <input type="button" className={"sign"} value={"Pieces"} onClick={this.handleChange}/><br/><br/>


          </form>)}
          {(sign && token) && (<div>
            <div className="App-header" id="loggedIn">
              <h2>Now Playing</h2>
              <img className="album" alt={"Loading Album Cover..."} src={albumArt} />
            </div>
            <div className="Artist-info">
            <p>Artist: {artistName}</p>
            <p>Track: {trackName}</p>
            <p>Album: {albumName}</p>
            <div>
              <button onClick={() => this.onPrevClick()}>Previous</button>
              <div className={"divider"}/>
              <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
              <div className={"divider"}/>
              <button onClick={() => this.onNextClick()}>Next</button>
            </div>
          </div></div>)}

          {(!token) && (<div>
            <div className="App-header">
            <h2>Authentication</h2>
            </div>
            <div className="Token-info">
            <a
            className="login"
            href={`${authEndpoint}client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
            Login to Spotify!
            </a>
            </div></div>)}
        </div>

    );
  }
}

export default App;
