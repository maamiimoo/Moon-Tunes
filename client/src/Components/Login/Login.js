import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Particles from "react-particles-js";
import { authEndpoint, clientID, redirectURI, scopes } from "../../User-config";
import hash from "../Hash/Hash";


// const particleOption = {
//   particles: {
//     number: {
//       value: 200,
//       density: {
//         enable: true,
//         value_area: 1000
//       }
//     }
//   }
// };
// class Login extends Component {
//   constructor() {
//     super();
//     this.state = {
//       username: "",
//       password: ""
//     };
//   }
//   handleChange = e => {
//     this.setState({ [e.target.name]: e.target.value });
//   };
//   handleSubmit = async e => {
//     e.preventDefault();
//     const loginResponse = await fetch("/users/login", {
//       method: "POST",
//       credentials: "include",
//       body: JSON.stringify(this.state),
//       headers: {
//         "Content-type": "application/json"
//       }
//     });

//     const parsedResponse = await loginResponse.json();
//     if (parsedResponse.user) {
//       this.props.doSetCurrentUser(parsedResponse.user);
//       this.props.history.push("/searchsongs");
//     }
//   };
//   render() {
//     console.log(this.state);
//     return (
//       <form onSubmit={this.handleSubmit} className="loginForm">
        
//         <Particles params={particleOption} className="particles" />
//       </form>
//     );
//   }
// }

// export default withRouter(Login);


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
            </div>
            <div className="Token-info">
            <a
            className="login"
            href={`${authEndpoint}client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
            </a>
            </div></div>)}
        </div>

    );
  }
}

export default App;