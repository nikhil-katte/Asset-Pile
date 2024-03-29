require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

// server connection
const url = process.env.DATABSAE;
const connect = mongoose.connect(url);

connect
  .then(() => {
    console.log("Connected correctly to server");
  })
  .catch((err) => {
    console.log("DB DIDNT CONNECT " + err);
  });

// routers
const usersRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// server setting
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", usersRoutes);
app.use("/api", authRoutes);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
