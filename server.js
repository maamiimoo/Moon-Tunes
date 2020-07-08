// // Provides a way to work with filepaths and directories
// var path = require('path');

// // Loads the passport module as a dependency
// // Passport functions and strategies are accessible
// // Authentication middleware for Node.js
// var passport = require('passport');

// // Loads the body-parser module as a dependency
// var bodyParser = require('body-parser');

// // Loads environment variables from the .env file into process.env
// // Configures the dotenv module
require('dotenv').config();

// // Loads the mongoose module as a dependency
// // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. 
// // Mongoose supports both promises and callbacks.
// // Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// var mongoose = require('mongoose');

// // Allows use of the passport Spotify OAuth Strategy
// var SpotifyStrategy = require('passport-spotify').Strategy;

// // Imports the credentials.js file
// // Returns the object containing the CLIENT_ID, SECRET_ID, REDIRECT_URI, MONGO_CONNECTION_PASSWORD 
// var credentials = require('./credentials');

// // Stores the Spotify client Id
// var clientId = credentials.credentials.id;

// // Stores the Spotify secret id
// var clientSecret = credentials.credentials.secret;

// // Stores the Spotify redirect uri
// var redirectUri = credentials.credentials.redirectUri;

// // Stores the MongoLab database user
// var databaseUser = credentials.credentials.mongoDatabaseUser;

// // Stores the MongoLab database password
// var databasePassword = credentials.credentials.mongoDatabasePassword;

// // Stores the MongoLab database connection string
// var databaseUri = credentials.credentials.mongoDatabaseUri;

var express = require('express');

// // Tells node that an express server is being created
var app = express();

var axios = require('axios');

// // Sets the port the express server will be running on
var PORT = process.env.PORT || 3000;

// // Loads the UserSchema
// var SpotifyUserModel = require('./models/User');

// // Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // Required to initialize passport with the express server
// app.use(passport.initialize());

// passport.serializeUser(function (user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

// // Loads the api-routes to server.js
// // Allows for custom API building with Express
// require('./routes/api-routes')(app);

// // Spotify authentication strategy authenticates users using a Spotify account and OAuth 2.0 tokens
// passport.use(new SpotifyStrategy(

//     {
//         // The clientID property given the value of the clientId variable(Stores the Spotify CLIENT_ID)
//         // The CLIENT_ID was created when the app was registered with Spotify
//         clientID: clientId,

//         // The clientSecret propery given the value of the clientSecret variable(Stores the Spotify CLIENT_SECRET)
//         // The URI to redirect to after the user grants or denies permission
//         clientSecret: clientSecret,

//         // The callbackURL property given the value of the redirectUri variable(Stores the SPOTIFY_REDIRECT_URI)
//         callbackURL: redirectUri
//     },
//     function (accessToken, refreshToken, expires_in, profile, done) {

//         SpotifyUserModel.findOne(
//             {
//                 // spotifyId: profile.id,

//             },

//             // This function is executed after successful user authorization
//             // The user parameter is stores the 
//             function (err, user) {
//                 if (err) {
//                     console.log(err);
//                 };

//                 // Creates a new instance of the SpotifyUserModel
//                 var newSpotifyUser = new SpotifyUserModel({

//                     // Builds the new user infortmation based from the SpotifyUserModel
//                     spotifyProfileId: profile.id,
//                     spotifyUserName: profile.username,
//                     email: profile._json.email,
//                     token: accessToken,
//                     refresh: refreshToken,
//                     expire: expires_in
//                 });


//                 // Adds the new user signed in to the database
//                 newSpotifyUser.save(function (err) {
//                     if (err) {
//                         console.log(err);
//                     };

//                 });

//                 return done(err, user);

//             });
//     }
// ));

// // Database connection for development
// // mongoose.connect('mongodb://localhost/spotify_users', {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// // });

// // Database connection for production
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://' + databaseUser + ':'
//     + databasePassword + '@ds029605.mlab.com:29605/heroku_wdp5clnd', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// // Serve static assets if in production


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// Starts the express server
app.listen(PORT, function () {
    console.log('Connected on port:' + PORT);
});
