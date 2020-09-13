const serverless = require("serverless-http");
const express = require("express");

// 3rd party library
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");

//Application Routes
const items = require("./routes/api/items");
const clientPage = require("./routes/api/client/ClientPage");
const about = require("./routes/api/aboutpage");
const skills = require("./routes/api/skillpage");
const blogs = require("./routes/api/blogapi");
const userauth = require("./routes/api/userauthapi");
const portfolio = require("./routes/api/PortfolioApi");
const app = express();

//Middleware
app.use(express.static("client/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// DB Config
const db = require("./config/key").mongoURI;

// Connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Use routes
app.use("/api/client", clientPage);
app.use("/api/items", items);
app.use("/api/about", about);
app.use("/api/skills", skills);
app.use("/api/blog", blogs);
app.use("/api/portfolio", portfolio);
app.use("/api/userauth", userauth);

module.exports = app;
