const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PortfolioSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: Array },
    url: { type: String}
});

module.exports = Portfolio = mongoose.model('portfolio', PortfolioSchema, 'portfolio');