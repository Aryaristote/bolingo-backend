
const User = require('../models/User');
const Token = require('../models/Token')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const saltRounds = 10; 

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

// create json web token
const createToken = (id) => {
  return jwt.sign({ id }, 'Bolingo@defaultpass', {
    expiresIn: 31536000000
  });
};

//Email account activation
module.exports.emailActivation_get = async (req, res) => {
  try {
    const tokenValue = req.params.token;

    // Find the token in the tokens table
    const token = await Token.findOne({ where: { token: tokenValue },
    });

    if (!token) {
      return res.status(404).send('Token not found ---');
    }

    // Update the user's verified status to true
    await User.update(
      {
        verified: true,
      },
      {
        where: {
          id: token.userId,
        },
      }
    );
    await Token.destroy({
      where: {
        id: token.id,
      },
    });

    res.send('Email activated');
  } catch (err) {
    res.status(400).send('An error occurred');
  }
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // This is the default port used by MailDev
  ignoreTLS: true,
});

const generateToken = () => {
  return uuidv4();
};

module.exports.signup_post = async (req, res) => {
  const { fname, email, countryCode, phoneNumber, password } = req.body;

  try {
    const verificationToken = generateToken();
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const existingPhoneNum = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneNum) {
      return res.status(400).json({ error: 'Phone number already exist' });
    }

    const user = await User.create({ fname, email, countryCode, phoneNumber, password, });
    const token = await Token.create({ userId: user.id, token: verificationToken });

    // Send the verification email
    const verificationLink = `http://localhost:5173/account-verification?token=${verificationToken}`;
    const mailOptions = {
      from: 'aryaristote@gmail.com',
      to: email,
      subject: 'Account Verification',
      html: `
        <p>Bolingo | Kingura</p>
        <div>
          <p>Here is your confirmation link: <br>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; 
              text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to activate your account
            </a>
          </p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log("User created successfully");
    res.status(200).json('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json('Error creating user');
  }
};

const resetPass_Token = () => {
  return uuidv4();
};

module.exports.reset_password = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }
    // Generate and save reset token with expiration
    const resetToken = resetPass_Token();
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset link to the user's email
    const resetLink = `http://localhost:5173/change-password?token=${resetToken}`;
    const mailOptions = {
      from: 'aryaristote@gmail.com',
      to: email,
      subject: 'Account Verification',
      html: `
        <p>Bolingo | Kingura</p>
        <div>
          <p>Here is the link for your reset password: <br>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #F7670C; color: white; 
              text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to activate your account
            </a>
          </p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Verify the token expiration
module.exports.verify_token = async (req, res) => {
  try {
    const { token } = req.body;
    const existingToken = await Token.findOne({ where: { token } });

    if (existingToken && !existingToken.used) { 
      console.log("exit")
      existingToken.used = true;
      await existingToken.save();
      res.status(200).json('valid');
    } else {
      console.log("No exit")
      res.status(200).json('invalid');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json('error');
  }
}

module.exports.change_password = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    let user = await User.findOne({ where: { resetToken: token } });

    if(user === newPassword){
      res.status(404).json({ message: 'You can set the old Password' });
    }
    if (user) {
      user.password = newPassword;
      user.resetToken = null; 
      await user.save(); 
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      res.status(404).json({ message: 'Invalid or expired reset token' });
    }
  } catch (error) {
    console.error('Error while updating/resetting password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
