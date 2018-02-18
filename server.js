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

  next();
});

var routes = require('./api/routes/accountRoutes');
routes(app); //register the route

app.listen(port);

console.log('good-accounts REST API server started on: ' + port);
