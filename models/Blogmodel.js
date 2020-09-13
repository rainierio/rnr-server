const mongoose = require('mongoose');
//const mongoose = require('mongoose').set('debug', true); debug mode on
const Schema = mongoose.Schema;

//Create Schema
const BlogSchema = new Schema({
    title: { type: String },
    content: { type: String },
    status: { type: Boolean },
    author_id: { type: String },
    category: { type: String },
    tags: { type: Array },
    header_img: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }

});

module.exports = Blog = mongoose.model('blog', BlogSchema, 'blog');