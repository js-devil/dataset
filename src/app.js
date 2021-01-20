require('dotenv').config();
//  --exec babel-node --

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// adding Helmet to enhance API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static folder
app.use(express.static(path.join(__dirname, '/../public')));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

const routes = require('./routes');

// API Routes
app.use(routes);

// request to handle undefined or all other routes
app.get('*', function (req, res) {
  // morgan.info("users route");
  return res.status(404).send({ error: 'not found' });
});

import errors from './middleware/errors';
app.use(errors);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
