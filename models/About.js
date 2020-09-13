const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

//Create Schema
const AboutSchema = new Schema({
    name: {type: String, required: true},
    occupation: {type: String, required: true},
    aboutdesc: {type: String, required: true},
    work: [
        { 
            work_id: Schema.Types.ObjectId,
            title: {type: String, required: true},
            company: {type: String, required: [true, 'company name required']},
            jobdesc: {type: String, required: true},
            location: {type: String, required: true},
            fromdate: {type: String, required: true},
            todate: {type: String, required: true},
        }
    ],
    education: [
        { 
            edu_id: Schema.Types.ObjectId,
            title: {type: String, required: true},
            institution: {type: String, required: true},
            location: {type: String, required: true},
            fromdate: {type: String, required: true},
            todate: {type: String, required: true},
        }
    ],
    project: [
        {
            project_id: Schema.Types.ObjectId,
            projectname: {type: String, required: true},
            projectdetail: {type: String, required: true},
            company: {type: String, required: true},
            projectdate: {type: String, required: true},
        }
    ]

});

module.exports = About = mongoose.model('about', AboutSchema, 'about');