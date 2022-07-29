require('dotenv').config();

const mongoose = require('mongoose');

const express = require('express');
// express middleware
const bodyParser = require('body-parser');
const expressSession = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(expressSession);

const Router = require('./lib/routes/Router');
const port = process.env.port;
const hostname = process.env.hostname;

connectDB().catch(err => console.log(err));

const app = express();

var sessionStorage = new MongoDBStore({
  uri: process.env.dbhost,
  collection: 'mySessions'
});
// Catch errors
sessionStorage.on('error', function(error) {
  console.log(error);
});

// parse body in application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Access to public files
app.use(express.static('public'));

// Bootstrap css and js public access
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/posts/update', express.static(__dirname + '/node_modules/bootstrap/dist'));

// renderer settings
app.set('views', './resources/views');
app.set('view engine', 'ejs');

// Session
app.use(expressSession({
  secret: '812929f9dcf73bd20677e371185be1576d2086bc',
  cookie: {
    maxAge: 1000 * 60 * 15 // 15 minutes
  },
  resave: true,
  store: sessionStorage,
  saveUninitialized: false
}));

Router.defineRoutes(app);

async function connectDB() {
  await mongoose.connect(process.env.dbhost);
}

app.listen(port, () => 
  console.log('server Express running in ' + hostname + ' on port ' + port)
);

exports.app = app; // for testing

