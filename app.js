const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');
const authLog = require('./routes/auth');
const bodyparser = require("body-parser");
const session = require('express-session');
const content = require('./routes/content');
const payments = require('./routes/stripe');
const localLog = require('./routes/authLog');
const cookieParser = require("cookie-parser");
const cookiesParser = require("cookie-parser"); 
const instructor = require('./routes/instructor'); 

// Load environment variables from .env file
dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Passport configuration
require('./passport');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cookieParser('Bolingo@defaultpass'));

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set('trust proxy', 1);
app.use(session({
  secret: 'Bolingo@defaultpass',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'lax',
    secure: false,
    maxAge: 172800000
  }
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(express.json());
app.use(cookiesParser()); 

// Database connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  define: {
    timestamps: false, // Disable auto-timestamps
  },
});
// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
});

// Routes
app.use(localLog);
app.use(authLog);
app.use(instructor);
app.use(content);
app.use(payments);
