var passport = require('passport');
const dotenv = require("dotenv");

var db = require("./db");

dotenv.config({ path: "./config/.env" })

var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:80/auth/facebook/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    db.getUtente(profile.displayName.toLowerCase().replaceAll(" ", "."))
        .then(function (user) {
            console.log("utente già inserito nel db");
        })
        .catch(function (err) {
          var utente = {
            _id: profile.displayName.toLowerCase().replaceAll(" ", "."),
            email: profile._json.email,
            logged_with: 'facebook',
          };
          db.inserisciUtente(utente);
        });
      return done(null, profile);
}
));