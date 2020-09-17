const express = require("express");
const router = express.Router();
const s3UploadPromise = require("../../utility/awsImageUpload");

// import skills model
const Portfolio = require("../../models/PortfolioModel");

// Auth middleware
const withAuth = require("../../middleware/Auth");

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
  const { title, status, description, category, company, url } = req.body;
  let imageArray = [];

  if (req.files) {
    let image = Object.values(req.files);
    image.map((img) => {
      // Proceed one image
      if (img.length === undefined) {
        s3UploadPromise(img, "portfolio")
          .then((data) => {
            imageArray.push(data.Location);
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
              .catch((err) =>
                res.send({
                  err,
                  errorMsg: "Error occured during saving, please try again",
                })
              );
          })
          .catch((err) =>
            res.send({
              err,
              errorMsg:
                "Error occured during uploading image, please try again",
            })
          );
      } else {
        // Proceed multiple image
        let totalImage = img.length;
        img.map((image) => {
          s3UploadPromise(image, "portfolio")
            .then((data) => {
              imageArray.push(data.Location);
              if (totalImage == imageArray.length) {
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
                    res.send({
                      portfolio,
                      successMsg: "New portfolio created",
                    });
                  })
                  .catch((err) =>
                    res.send({
                      err,
                      errorMsg: "Error occured during saving, please try again",
                    })
                  );
              }
            })
            .catch((err) =>
              res.send({
                err,
                errorMsg:
                  "Error occured during uploading image, please try again",
              })
            );
        });
      }
    });
  } else {
    Portfolio.create({
      title,
      status,
      description,
      category,
      company,
      url,
    })
      .then((portfolio) => {
        res.send({ portfolio, successMsg: "New portfolio created" });
      })
      .catch((err) =>
        res.send({
          err,
          errorMsg: "Error occured during saving, please try again",
        })
      );
  }
});

//@route    PUT api/portfolio/:id
//@desc     Edit portfolio
//@access   Admin
router.put("/:id", withAuth, (req, res, next) => {
  const { title, status, description, category, company, url } = req.body;
  let imageArray = [];
  // Set previous image before add the new images
  if (req.body.uploadedImages !== "") {
    imageArray.push(...req.body.uploadedImages.split(","));
  }

  if (req.files) {
    let image = Object.values(req.files);
    image.map((img) => {
      // Proceed one image
      if (img.length === undefined) {
        s3UploadPromise(img, "portfolio")
          .then((data) => {
            imageArray.push(data.Location);
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
              .then((portfolio) =>
                res.send({ portfolio, successMsg: "Record updated" })
              )
              .catch((err) =>
                res.send({
                  err,
                  errorMsg: "Error occured during update, please try again",
                })
              );
          })
          .catch((err) =>
            res.send({
              err,
              errorMsg:
                "Error occured during uploading image, please try again",
            })
          );
      } else {
        // Proceed multiple image
        let totalImage = img.length + imageArray.length;
        img.map((image) => {
          s3UploadPromise(image, "portfolio")
            .then((data) => {
              imageArray.push(data.Location);
              if (totalImage == imageArray.length) {
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
                  .then((portfolio) =>
                    res.send({ portfolio, successMsg: "Record updated" })
                  )
                  .catch((err) =>
                    res.send({
                      err,
                      errorMsg: "Error occured during update, please try again",
                    })
                  );
              }
            })
            .catch((err) =>
              res.send({
                err,
                errorMsg:
                  "Error occured during uploading image, please try again",
              })
            );
        });
      }
    });
  } else {
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
      .then((portfolio) =>
        res.send({ portfolio, successMsg: "Record updated" })
      )
      .catch((err) =>
        res.send({
          err,
          errorMsg: "Error occured during update, please try again",
        })
      );
  }
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
