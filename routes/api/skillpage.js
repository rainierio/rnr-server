const express = require('express');
const router = express.Router();

// import skills model
const Skills = require('../../models/Skillsmodel');

// Custom middleware
const withAuth = require('../../middleware/Auth');

//@route    GET api/skills/admin/getskills
//@desc     Get all skills
//@access   Admin
router.get('/admin/getskills', withAuth, (req, res, next) => {
    Skills.find()
    .then(skills => res.json(skills))
 });

//@route    POST api/skills/admin/addskill
//@desc     Add new skill
//@access   Admin
router.post('/admin/addskill', withAuth, (req, res) => {
    const newSkill = new Skills(req.body)
    newSkill.save()
    .then(skill => res.send({skill, successMsg: "New Skill created"}))
    .catch(err => res.send({err, errorMsg:"New skill not created"}))
})

//@route    PUT api/skills/admin/editskill
//@desc     Edit skill
//@access   Admin
router.put('/admin/editskill/:id', withAuth, (req, res, next) => {
    const { skillname, category } = req.body
    Skills.findByIdAndUpdate(
        { _id: req.params.id },
        {
            skillname,
            category
        },
        {
            new: true
        }
    )
    .then(skill => res.send({skill, successMsg:"Record updated"}))
    .catch(err => res.send({err, errorMsg:"Error update"}))
})

//@route    DELETE api/skills/admin/deleteskill
//@desc     Delete
//@access   Admin
router.delete('/admin/deleteskill/:id', withAuth, (req, res, next) => {
    Skills.findByIdAndDelete(
        { _id: req.params.id}
    )
    .then(() => res.send({successMsg:"Record deleted"}))
    .catch(err => res.send({err, errorMsg:"Error delete"}))
})

 module.exports = router;