const express = require('express');
const router = express.Router();

// import about model
const About = require('../../models/About');

// Custom middleware
const withAuth = require('../../middleware');

//@route    GET api/about
//@desc     Get all about information
//@access   Public
router.get('/', (req, res) => {
   About.findOne()
   .then(about => res.json(about))
});


//Route for admin site
//@route    GET api/about/admin
//@desc     Get all about information
//@access   Admin
router.get('/admin/', withAuth, (req, res) => {
   About.findOne()
   .then(about => res.json(about))
});

//Route for admin site

//@route    PUT api/about/admin
//@desc     Update basic information
//@access   Admin
router.put('/admin/about/:id', withAuth, (req, res) => {
   let id = req.params.id
   About.findByIdAndUpdate(
      {_id: id},
      {
         name: req.body.basicInfo.name,
         occupation: req.body.basicInfo.occupation,
         email: req.body.basicInfo.email,
         aboutdesc : req.body.basicInfo.aboutdesc
      },
      {
         new: true
      }
   )
   .then(basicInfo => res.send({basicInfo, msg:'Basic info successfully updated'}))
   .catch(err => res.send({err, errMsg: "Basic info are not successfully updated, please try again"})) // error here when update not success
});


// Education section API's 
//@route    Add api/about/admin/edu
//@desc     Add new education
//@access   Admin
router.put('/admin/edu/:id', withAuth, (req, res) => {
   let id = req.params.id
   let eduObj = {
      title: req.body.newEducation.title,
      institution: req.body.newEducation.institution,
      location: req.body.newEducation.location,
      fromdate: req.body.newEducation.fromDate,
      todate: req.body.newEducation.toDate
   }
   About.findByIdAndUpdate(
      {_id: id},
      {
         $push: {education: eduObj}
      },
      {
         new: true,
         runValidators: true

      }
   )
   .then(basicInfo => res.send({basicInfo, successMsg:'New education saved'}))
   .catch(err => res.send({err, errorMsg: "New education are not successfully updated, please try again"})) // error here when update not success
});

//@route    EDIT api/about/admin/editedu/id
//@desc     Edit education
//@access   Public
router.put('/admin/editedu/:id', withAuth, (req, res) => {
   let id = req.params.id
   let eduId = req.body.editEdu.edu_id
   
   About.findById(id)
      .then(about => {
         const edu = about.education.id(eduId)
         edu.set({
            title: req.body.editEdu.title,
            institution: req.body.editEdu.institution,
            location: req.body.editEdu.location,
            todate: req.body.editEdu.toDate,
            fromdate: req.body.editEdu.fromDate,

         })
         return about.save()
      })
      .then(basicInfo => { res.send({basicInfo, successMsg:"Successfully updated"})})
      .catch(err => res.send({err, errorMsg:"Update error"}))
      
});

//@route    DELETE api/about/admin/deleteedu/id
//@desc     Delete education
//@access   Public
router.put('/admin/deleteedu/:id', withAuth, (req, res) => {
   let id = req.params.id
   let eduId = req.body.keyId
   About.findByIdAndUpdate(
      {_id: id},
      {
         $pull: {education: {_id: eduId}}
      },
      {
         new: true
      }
   )
   .then(basicInfo => res.send({basicInfo, msg:'Basic info successfully updated'}))
   .catch(err => res.send({err, errMsg: "Basic info are not successfully updated, please try again"})) // error here when update not success
});

// Work experience section API's
//@route    Add api/about/admin/work
//@desc     Add new work
//@access   Admin
router.put('/admin/work/:id', withAuth, (req, res) => {
   let id = req.params.id
   let workObj = {
      title: req.body.newWork.title,
      company: req.body.newWork.company,
      jobdesc: req.body.newWork.jobdesc,
      location: req.body.newWork.location,
      fromdate: req.body.newWork.fromdate,
      todate: req.body.newWork.todate
   }
   About.findByIdAndUpdate(
      {_id: id},
      {
         $push: {work: workObj}
      },
      {
         new: true,
         runValidators: true
      }
   )
   .then(basicInfo => res.send({basicInfo, msg:'Basic info successfully updated'}))
   .catch(err => res.send({err, errMsg: "Basic info are not successfully updated, please try again"})) // error here when update not success
});

//@route    EDIT api/about/admin/editwork/id
//@desc     Edit work
//@access   Public
router.put('/admin/editwork/:id', withAuth, (req, res) => {
   let id = req.params.id
   let workId = req.body.editWork._id
   
   About.findById(id)
      .then(about => {
         const edu = about.work.id(workId)
         edu.set({
            title: req.body.editWork.title,
            company: req.body.editWork.company,
            jobdesc: req.body.editWork.jobdesc,
            location: req.body.editWork.location   ,
            fromdate: req.body.editWork.fromdate,
            todate: req.body.editWork.todate
         })
         return about.save()
      })
      .then(basicInfo => { res.send({basicInfo, successMsg:"Successfully updated"})})
      .catch(err => res.send({err, errorMsg:"Update error"}))
      
});

//@route    DELETE api/about/admin/deletework/id
//@desc     Delete work
//@access   Public
router.put('/admin/deletework/:id', withAuth, (req, res) => {
   let id = req.params.id
   let workId = req.body.keyId
   About.findByIdAndUpdate(
      {_id: id},
      {
         $pull: {work: {_id: workId}}
      },
      {
         new: true
      }
   )
   .then(basicInfo => res.send({basicInfo, msg:'Work successfully deleted'}))
   .catch(err => res.send({err, errMsg: "Work are not successfully updated, please try again"})) // error here when update not success
});

// Project list section API's
//@route    Add api/about/admin/addproject/:parentid
//@desc     Add new project
//@access   Admin
router.put('/admin/addproject/:id', withAuth, (req, res) => {
   let id = req.params.id
   let prjObj = {
      projectname: req.body.newProj.projectname,
      projectdetail: req.body.newProj.projectdetail,
      company: req.body.newProj.company,
      projectdate: req.body.newProj.projectdate
   }
   About.findByIdAndUpdate(
      {_id: id},
      {
         $push: {project: prjObj}
      },
      {
         new: true,
         runValidators: true
      }
   )
   .then(basicInfo => res.send({basicInfo, successMsg:'New project successfully added'}))
   .catch(err => res.send({err, errorMsg: "New Project are not successfully updated, please try again"}))
});

//@route    EDIT api/about/admin/editproject/id
//@desc     Edit project
//@access   Admin
router.put('/admin/editproject/:id', withAuth, (req, res) => {
   let id = req.params.id
   let projectId = req.body.editProj._id
   
   About.findById(id)
      .then(about => {
         const prj = about.project.id(projectId)
         prj.set({
            projectname: req.body.editProj.projectname,
            projectdetail: req.body.editProj.projectdetail,
            company: req.body.editProj.company,
            projectdate: req.body.editProj.projectdate
         })
         return about.save()
      })
      .then(basicInfo => { res.send({basicInfo, successMsg:"Project Successfully updated"})})
      .catch(err => res.send({err, errorMsg:"Update error"}))
      
});

//@route    DELETE api/about/admin/deletewproject/parentid
//@desc     Delete project
//@access   Admin
router.put('/admin/deleteproject/:id', withAuth, (req, res) => {
   let id = req.params.id
   let projId = req.body.keyId
   About.findByIdAndUpdate(
      {_id: id},
      {
         $pull: {project: {_id: projId}}
      },
      {
         new: true
      }
   )
   .then(basicInfo => res.send({basicInfo, msg:'Project successfully deleted'}))
   .catch(err => res.send({err, errMsg: "Project are not successfully deleted, please try again"}))
});

module.exports = router;
