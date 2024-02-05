var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

var routes = require('../routes/index');

app.use(cors());
app.use("/", routes);
app.use(bodyParser.raw({ type: "application/octet-stream" }));


module.exports = app;