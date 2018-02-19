var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000
  mongoose = require('mongoose'),
  {Account, Transaction} = require('./api/models/index'),
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/GoodAccounts');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow access to the website
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var accountRoutes = require('./api/routes/accountRoutes');
var transactionRoutes = require('./api/routes/transactionRoutes');
accountRoutes(app); //register the route
transactionRoutes(app); //register the route

app.listen(port);

console.log('good-accounts REST API server started on: ' + port);
