var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const { Middleware } = require('../middleware/index');
var routes = require('../routes/index');
const errorHandler = require('../middleware/ErrorHandler');


const middleware = new Middleware();

app.use(cors());
app.use(bodyParser.raw({ type: "application/octet-stream" }));
app.use("/api", routes);
// app.use(errorHandler); // Error handler middleware
app.get("/", (req, res) => {
    res.send("Hello World");
});



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;