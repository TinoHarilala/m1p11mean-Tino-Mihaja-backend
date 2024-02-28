

// Error handler middleware
function errorHandler(err, req, res, next) {
    res.status(401).json({ error: err.message }); // or any other response
}

module.exports = errorHandler;
