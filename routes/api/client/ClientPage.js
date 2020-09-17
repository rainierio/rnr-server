const express = require("express");
const router = express.Router();
const stringStrip = require("string-strip-html");

// import about model
const About = require("../../../models/About");
const Skills = require("../../../models/Skillsmodel");
const Blog = require("../../../models/Blogmodel");
const Portfolio = require("../../../models/PortfolioModel");
const Service = require("../../../models/ServiceModel");
const Contact = require("../../../models/Contactmodel");

//@route    GET api/aboutme
//@desc     Get all about me section information
//@access   Public
router.get("/aboutme", async (req, res) => {
  About.find()
    .then((about) => {
      Skills.find().then((skills) => res.json({ about, skills }));
    })
    .catch((err) => res.json(err));
});

//@route    GET api/homelanding
//@desc     Get all required information for landing page
//@access   Public
router.get("/homelanding", async (req, res) => {
  About.find({}, "name occupation email aboutdesc")
    .then((about) => {
      Blog.aggregate([
        {
          $project: {
            title: 1,
            header_img: 1,
            category: 1,
            createdAt: 1,
          },
        },
        {
          $limit: 3,
        },
      ]).then((blog) => {
        Service.find({}, "title introdesc icon").then((services) =>
          res.json({ about, blog, services })
        );
      });
    })
    .catch((err) => res.json(err));
});

//@route    GET api/services
//@desc     Get list of services for landing page
//@access   Public
router.get("/services", async (req, res) => {
  Service.find()
    .then((services) => {
      res.send({ services });
    })
    .catch((err) => res.json(err));
});

//@route    GET api/servicedetail/:id
//@desc     Get services detail
//@access   Public
router.get("/servicedetail/:id", async (req, res) => {
  Service.findOne({ _id: req.params.id })
    .then((services) => {
      res.send({ services });
    })
    .catch((err) => res.json(err));
});

//@route    GET api/portfolio
//@desc     Get all portfolio item
//@access   Public
router.get("/portfolios", async (req, res) => {
  Portfolio.find({}, "title image status category")
    .then((portfolio) => res.json(portfolio))
    .catch((err) => res.json(err));
});

//@route    GET api/portfoliodetail:id
//@desc     Get portfolio details
//@access   Public
router.get("/portfoliodetail/:id", (req, res) => {
  Portfolio.findOne({ _id: req.params.id })
    .then((portfolio) => res.json(portfolio))
    .catch((err) => res.json(err));
});

//@route    GET api/blogs
//@desc     Get all blogs
//@access   Public
router.get("/blogs", async (req, res) => {
  Blog.aggregate([
    {
      $match: { status: true },
    },
    {
      $project: {
        title: 1,
        content: 1,
        header_img: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ])
    .then((blog) => {
      blog.forEach((post) => {
        post.content = stringStrip(post.content).substr(0, 300);
      });
      res.json(blog);
    })
    .catch((err) => res.json(err));
});

//@route    GET api/blogdetail/:id
//@desc     Get blog detail
//@access   Public
router.get("/blogdetail/:id", (req, res) => {
  Blog.findOne({ _id: req.params.id })
    .then((blog) => res.json(blog))
    .catch((err) => res.json(err));
});

//@route    Post api/contactform/
//@desc     Add new contact request to database
//@access   Public
router.post("/contactform/", (req, res) => {
  const newContact = new Contact(req.body)
  newContact.save()
  .then(contact => res.send({successMsg: "Your message has been received"}))
  .catch(err => res.send({errorMsg:err.message}))
})

module.exports = router;
