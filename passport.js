const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const passport = require('passport'); 
const User = require("./models/User");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '930100866404-hhne9ted66u588sjlpkv1itilfke8qtt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

FACEBOOK_APP_ID = "816054979961020"; 
FACEBOOK_APP_SECRET = "166dd60b8378a203cc16e7ba768c514e";

//Google Login
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true, 
},
async function(request, accessToken, refreshToken, profile, done) {
    try {
      let email = profile.emails[0].value;
      let user = await User.findOne({ where: { email } });
      if (user) {
          const secretKey = 'Bolingo@defaultpass';
          done(null, user);
      } else {
        const user = await User.create({
          googleId: profile.id,
          fname: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          provider: profile.provider
        });
  
        console.log("New user created");
        done(null, user);
      }
    } catch (error) {
        console.error('Error while saving user:', error);
        return done(error, false); 
    }
  }
));

// Local login 
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          where: {
            [Op.or]: [{ email: username }, { phoneNumber: username }],
          },
        });

        if (!user) {
          console.log("Incorrect username")
          return done(null, false, { status: 401, message: 'Incorrect username or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          console.log("Incorrect password")
          return done(null, false, { status: 401, message: 'Incorrect username or password' });
        }

        // Success: return user with a 200 status code
        console.log("Connected: ", user)
        return done(null, user, { status: 200 });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


//Facebook Login
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'],
  },
  async function (accessToken, refreshToken, profile, done) {
    let user;

    try {
      // Check if the user already exists in the database
      console.log("profile.provider");
        user = await User.findOne({ facebookId: profile.id });
        if (user) {
            console.log('User already exists:');
            return done(null, user);
        } else {
          const user = new User({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash('Bolingo@defaultpass', saltRounds);
          user.password = hashedPassword;
          const savedUser = await user.save(); // Saving data

          // Generate the JWT token with the expiresIn option set
          const secretKey = 'Bolingo@defaultpass'; // Replace with your actual secret key
          const token = jwt.sign({ userId: savedUser._id }, secretKey, { expiresIn: '1d' });
          request.res.cookie('jwt', token, { httpOnly: true, maxAge: 31536000000 }); // Max age set to 1 day in millisecond
          return done(null);
        }
    } catch (error) {
        // Handle the error gracefully
        if (error.code === 11000) {
            console.log('User with this email already exists. Please log in.');
            // Generate the JWT token with the expiresIn option set
            const secretKey = 'Bolingo@defaultpass';
            const token = jwt.sign({ userId: profile.id }, secretKey, { expiresIn: '1d' });
            request.res.cookie('jwt', token, { httpOnly: true, maxAge: 31536000000 });

            return request.res.redirect('http://localhost:5173/dashboard');
        } else {
            console.error('Error while saving user:', error);
            return done(error, false); 
        }
    }
  })
);

