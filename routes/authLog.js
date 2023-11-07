const express = require('express'); // Import the express module
const router = express.Router(); // Create an instance of the router
const authControllers = require('../controllers/authControllers');
const User = require('../models/User')
const passport = require('passport'); 

router.get('/signup', authControllers.signup_get);  
router.post('/signup', authControllers.signup_post); 
router.post('/reset-password', authControllers.reset_password); 
router.get('/email-activation/:token', authControllers.emailActivation_get); 
router.post('/change-password', authControllers.change_password); 
router.get('/confirm/:token', authControllers.emailActivation_get);
router.post('/verify-token', authControllers.verify_token);
//------------------------------- Passport Local
passport.serializeUser((user, done) => {
    done(null, user.id); // Use an identifier, like the user's ID
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
}); 

router.get('/user', (req, res) => {
    res.send(req.user)
})

router.post('/signin', async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      console.log({ error, info, user });
      if (error || !user) {
        return res.status(401).json({ success: false, message: info.message || 'Login failed', error });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
  
        return res.json({ success: true, message: 'Login was successful', user });
      });
    })(req, res, next);
});
//------------------------------- Passport Local

// ... other routes

module.exports = router;