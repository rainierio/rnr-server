const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// const morgan = require("morgan");
require("dotenv").config();

// ----------------------------------
// Routes Import
// ----------------------------------
const clientPage = require("./routes/api/client/ClientPage");
const about = require("./routes/api/aboutpage");
const skills = require("./routes/api/skillpage");
const blogs = require("./routes/api/blogapi");
const userauth = require("./routes/api/userauthapi");
const portfolio = require("./routes/api/PortfolioApi");
const app = express();

// ----------------------------------
// Express configuration
// ----------------------------------
app.use(express.static("client/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
// app.use(morgan("dev"));
// ----------------------------------
// Database connection
// ----------------------------------
const connectDB = require("./config/db");
connectDB();

// ----------------------------------
// API's routes
// ----------------------------------
app.use("/api/client", clientPage);
app.use("/api/about", about);
app.use("/api/skills", skills);
app.use("/api/blog", blogs);
app.use("/api/portfolio", portfolio);
app.use("/api/userauth", userauth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// ----------------------------------
// Express server => claudia upload
// ----------------------------------
// module.exports = app;
