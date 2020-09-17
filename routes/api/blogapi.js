const express = require("express");
const router = express.Router();
const stringStrip = require("string-strip-html");
const AWS = require("aws-sdk");

// Import blog model
const Blog = require("../../models/Blogmodel");

// Auth middleware
const withAuth = require("../../middleware/Auth");

// AWS S3 config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create S3 instance
const s3 = new AWS.S3();

//@route    GET api/blog
//@desc     Get all article
//@access   Public
router.get("/", withAuth, (req, res) => {
  Blog.aggregate([
    {
      $project: {
        title: 1,
        content: { $substrBytes: ["$content", 0, 750] },
        header_img: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $limit: 10,
    },
  ]).then((blog) => {
    blog.forEach((post) => {
      post.content = stringStrip(post.content).substr(0, 350);
    });
    res.json(blog);
  });
});

//@route    GET api/blog/id
//@desc     Get single
//@access   Public
router.get("/:id", withAuth, (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => res.json(blog))
    .catch((err) => res.json("Post not found"));
});

//@route    POST api/blog
//@desc     Create new article
//@access   Admin
router.post("/", withAuth, (req, res) => {
  const { title, content, status, category, tags } = req.body;

  if (req.files) {
    let image = Object.values(req.files);
    const buffer = Buffer.from(image[0].data, "binary");
    const type = image[0].mimetype;
    const name = image[0].name;
    const timestamp = Date.now().toString();
    const fileName = `blog/${timestamp}-${name}`;

    // Parameters setting
    const params = {
      ACL: "public-read",
      Body: buffer,
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: type,
      Key: `${fileName}`,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
      } else {
        const newArticle = new Blog({
          title: title,
          content: content,
          status: status,
          category: category,
          tags: tags,
          header_img: data.Location,
          author_id: "rainierio",
        });
        newArticle.save().then((resp) =>
          res.send({
            msg: "Article successfully created",
            resp,
          })
        );
      }
    });
  } else {
    const newArticle = new Blog({
      title: title,
      content: content,
      status: status,
      category: category,
      tags: tags,
      author_id: "rainierio",
    });
    newArticle.save().then((resp) =>
      res.send({
        msg: "Article successfully created",
        resp,
      })
    );
  }
});

//@route    PUT api/blog/id
//@desc     Update article
//@access   Public
router.put("/:id", withAuth, (req, res) => {
  const { title, content, status, category, tags, image } = req.body;
  
  if (req.files) {
    let image = Object.values(req.files);
    const buffer = Buffer.from(image[0].data, "binary");
    const type = image[0].mimetype;
    const name = image[0].name;
    const timestamp = Date.now().toString();
    const fileName = `blog/${timestamp}-${name}`;

    // Parameters setting
    const params = {
      ACL: "public-read",
      Body: buffer,
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: type,
      Key: `${fileName}`,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
      } else {
        Blog.updateOne(
          { _id: req.params.id },
          {
            title: title,
            content: content,
            status: status,
            updatedAt: Date.now(),
            category: category,
            tags: tags,
            header_img: data.Location,
            author_id: "rainierio",
          }
        )
          .then((data) =>
            res.send({ data, msg: "Article successfully updated" })
          )
          .catch((err) =>
            res.send({
              err,
              errMsg: "Post are not successfully updated, please try again",
            })
          );
      }
    });
  } else {
    Blog.updateOne(
      { _id: req.params.id },
      {
        title: title,
        content: content,
        status: status,
        updatedAt: Date.now(),
        category: category,
        tags: tags,
        header_img: image,
        author_id: "rainierio",
      }
    )
      .then((data) => res.send({ data, msg: "Article successfully updated" }))
      .catch((err) =>
        res.send({
          err,
          errMsg: "Post are not successfully updated, please try again",
        })
      );
  }
});

//@route    DELETE api/blog/id
//@desc     Delete article
//@access   Public
router.delete("/:id", withAuth, (req, res) => {
  Blog.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      res.send({
        respMsg: "Article are not successfully deleted!, please try again",
        errInfo: true,
        err,
      });
    } else {
      res.send({
        respMsg: "Article successfully deleted!",
        errInfo: false,
        result,
      });
    }
  });
});

module.exports = router;
