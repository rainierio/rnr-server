const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

//Create Schema
const SkillsSchema = new Schema({
    skillname: { type: String },
    category: { type: String }
});

module.exports = Skill = mongoose.model('skills', SkillsSchema, 'skills');