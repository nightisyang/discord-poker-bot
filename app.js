const express = require("express");
const morgan = require("morgan");

const app = express();

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

module.exports = app;
