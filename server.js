var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000
  mongoose = require('mongoose'),
  {Account, Transaction} = require('./api/models/index'),
  bodyParser = require('body-parser')
  helmet = require('helmet')
  jsonwebtoken = require('jsonwebtoken');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/GoodAccounts');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow access to the website
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// Authorization middleware
app.use((req, res, next) => {
  // Check if the authorization header is set
  if (req.headers && req.headers.authorization
  && req.headers.authorization.split(' ')[0] === 'JWT') {
    const token = req.headers.authorization.split(' ')[1];
    // TODO : Change key
    jsonwebtoken.verify(token, 'RESTAPIKEY', (err, decode) => {
      req.user = !err ? decode : undefined;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// Register the API routes
var routes = require('./api/routes/index');
routes(app);

// Error middleware
app.use(({ errorCode, message, error }, req, res, next) => {
  res.status(errorCode || 500).send({message, error});
});

app.listen(port);

console.log('good-accounts REST API server started on: ' + port);
