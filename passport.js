const jwt = require('jsonwebtoken');
const passport = require('passport'); 
const bcrypt = require('bcrypt');
const User = require("./models/User");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const GOOGLE_CLIENT_ID = '930100866404-hhne9ted66u588sjlpkv1itilfke8qtt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

FACEBOOK_APP_ID = "816054979961020"; 
FACEBOOK_APP_SECRET = "166dd60b8378a203cc16e7ba768c514e";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await User.findOne({ id: userId }); 
  done(null, user);
});

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

passport.use(
  new LocalStrategy(
    {
      usernameField: 'emailOrPhone', // The field that can be email or phoneNumber
      passwordField: 'password', // The password field
    },
    async (emailOrPhone, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or phoneNumber' });
        }

        const isUserVerified = await User.findOne({
            $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
            verified: true, 
        });
    
        if (!isUserVerified) {
            console.log('User is not verified');
            return done(null, false, { message: 'User is not verified' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Love in air");
        if (!isPasswordMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error); 
      }
    }
  )
);

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

