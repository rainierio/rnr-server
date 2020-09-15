const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// import skills model
const Portfolio = require("../../models/PortfolioModel");

// Auth middleware
const withAuth = require('../../middleware/Auth');

//@route    GET api/portfolio/
//@desc     Get all summary portfolio
//@access   Public
router.get("/", (req, res, next) => {
  Portfolio.find().then((portfolios) => res.json(portfolios));
});

//@route    GET api/portfolio/detail/:id
//@desc     Get one detail portfolio
//@access   Public
router.get("/detail/:id", (req, res, next) => {
  Portfolio.findOne({ _id: req.params.id }).then((portfolio) =>
    res.json(portfolio)
  );
});

//@route    POST api/portfolio/
//@desc     Add new portfolio
//@access   Admin
router.post("/", withAuth, (req, res) => {
  let imageArray = [];
  let uuid = uuidv4();
  if (req.files) {
    let image = Object.values(req.files);
    image.map((img) => {
      // Proceed one image
      if (img.length === undefined) {
        img.mv("client/public/portfolio/" + uuid + "_" + img.name);
        imageArray.push(uuid + "_" + img.name);
      } else {
        // Proceed multiple image
        img.map((item) => {
          item.mv("client/public/portfolio/" + uuid + "_" + item.name);
          imageArray.push(uuid + "_" + item.name);
        });
      }
    });
  }
  const { title, status, description, category, company, url } = req.body;

  // const newPortfolio = new Portfolio(req.body);
  // newPortfolio
  Portfolio.create({
    title,
    status,
    description,
    category,
    company,
    url,
    image: imageArray,
  })
    .then((portfolio) => {
      res.send({ portfolio, successMsg: "New portfolio created" });
    })
    .catch((err) => res.send({ err, errorMsg: "New portfolio not created" }));
});

//@route    PUT api/portfolio/:id
//@desc     Edit portfolio
//@access   Admin
router.put("/:id", withAuth, (req, res, next) => {
  const { title, status, description, category, company, url } = req.body;
  let imageArray = [];
  let uuid = uuidv4();
  // Set previous image before add the new images
  if (req.body.uploadedImages !== "") {
    imageArray.push(...req.body.uploadedImages.split(","));
  }

  if (req.files) {
    let image = Object.values(req.files);
    image.map((img) => {
      // Proceed one image
      if (img.length === undefined) {
        img.mv("client/public/portfolio/" + uuid + "_" + img.name);
        imageArray.push(uuid + "_" + img.name);
      } else {
        // Proceed multiple image
        img.map((item) => {
          item.mv("client/public/portfolio/" + uuid + "_" + item.name);
          imageArray.push(uuid + "_" + item.name);
        });
      }
    });
  }

  Portfolio.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title,
      status,
      description,
      category,
      company,
      url,
      image: imageArray,
    },
    {
      new: true,
    }
  )
    .then((portfolio) => res.send({ portfolio, successMsg: "Record updated" }))
    .catch((err) => res.send({ err, errorMsg: "Error update" }));
});

//@route    DELETE api/portfolio/:id
//@desc     Delete
//@access   Admin
router.delete("/:id", withAuth, (req, res, next) => {
  Portfolio.findByIdAndDelete({ _id: req.params.id })
    .then(() => res.send({ successMsg: "Record deleted" }))
    .catch((err) => res.send({ err, errorMsg: "Error delete" }));
});

module.exports = router;
