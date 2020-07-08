import React from "react";
import { NavLink } from "react-router-dom";
import { authEndpoint, clientID, redirectURI, scopes } from "../Users/User-config";
import hash from "../Hash/Hash";
import "./AppNavbar.css";

import * as routes from "../constants/routes";

const NavBar = ({ currentUser }) => (
  <div className="navDiv">
    
    {currentUser
      ? [
          
        ]
      : [

          
          <NavLink
          
            key={2}
            to={"/login"}
            className="Token-info"
            activeClassName="selected"
            href={`${authEndpoint}client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
          >
            Login to Spotify
          </NavLink>
        ]}
  </div>
);

export default NavBar;
