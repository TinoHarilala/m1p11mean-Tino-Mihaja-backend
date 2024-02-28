var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const { Middleware } = require('../middleware/index');
var routes = require('../routes/index');
const errorHandler = require('../middleware/ErrorHandler');

const middleware = new Middleware();

app.use(cors());
app.use("/", routes);
app.use(errorHandler); // Error handler middleware
app.use(bodyParser.raw({ type: "application/octet-stream" }));


module.exports = app;