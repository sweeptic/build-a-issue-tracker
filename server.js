'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
let port = process.env.PORT;

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
app.use('/api', apiRoutes);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    if (port == null || port == '') {
      port = 8000;
    }

    app.listen(port, function () {
      if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch (e) {
            let error = e;
            console.log('Tests are not valid:');
            console.log(error);
          }
        }, 3500);
      }
    });
  })

  .catch(err => console.log(err));

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

module.exports = app; //for testing
