const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Secret key
const secret = 'EzGDaF0dQvu62UA0UNp7MzbGHLlukzv'

//Skills model
const UserAuth = require('../../models/Userauthmodel');

// Custom middleware
const withAuth = require('../../middleware');

//@route    GET api/userauth
//@desc     Get user detail information
//@access   Public
router.get('/', withAuth, (req, res) => {
    UserAuth.find()
    .then(users => res.json(users))
    .catch(err => res.json({msg:"User not found", err}))
 });

//@route    Post api/userauth
//@desc     Create new user
//@access   Public
router.post('/',withAuth,(req, res) => {
    const newUser = new UserAuth({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        createdat: Date.now()
    });
    newUser.save().then(userResp => res.send({
       msg: 'New user successfully created'
    })).catch(err => res.send({msg:"error user creation", err}));
 });


//@route    Post api/authenticate
//@desc     Auhtenticate user login
//@access   Public
router.post('/authenticate', (req, res) => {
    const email = req.body.loginData.userName
    const password = req.body.loginData.password
    UserAuth.findOne({email: email}, (err, user) => {
        if (err) {
            res.status(500).json({error:"login error, please try again"})
        } else if (!user) {
            res.status(401).json({error:"incorect email or username"})
        } else {
            user.isCorrectPassword(password, function(err, same){
                if (err) {
                    res.status(500).json({error:"login error, please try again"})
                } else if(!same) {
                    console.log("error password")
                    res.status(401).json({error:"Incorrect password"})
                }else {
                    //user logged then generate JWT
                    const payload = {email};
                    let userSession = jwt.sign(payload, secret, {
                        expiresIn: '300m'
                    })
                    res.cookie('USER_SESSION', userSession, { httpOnly: false })
                    .status(200).json({username: user.username, email: user.email});
                }
            })
        }
    })

 });

//@route    Post api/logout
//@desc     User logout
//@access   Public
router.get('/logout', (req, res) => {
    
})

//@route    Post api/userprofile
//@desc     User logout
//@access   Public
router.get('/userprofile', withAuth, (req, res) => {
    UserAuth.findOne({email: req.email}, (err, user) => {
        if (user) {
            res.status(200).send({
                username: user.username, 
                email: user.email, 
                firstname: user.firstname,
                lastname: user.lastname
            });    
        } else {
            res.status(401).send({error: "User not found"})
        }
    })
})

//@route    get api/check token
//@desc     Check user current token
//@access   Public
router.get('/checktoken', withAuth, (req, res) => {
    UserAuth.findOne({email: req.email}, (err, user) => {
        if (user) {
            res.status(200).send({username: user.username, email: user.email});    
        } else {
            res.status(401).send({error: "invalid token"})
        }
    })
 });

//@route    Put api/userauth
//@desc     Update user profile and password
//@access   Public
router.put('/updateprofile', (req, res) => {
    const { userEmail, userName, firstName, lastName, currentPassword, newPassword, repeatNewPassword  } = req.body
    if (currentPassword && newPassword && repeatNewPassword) {
        UserAuth.findOne({email: userEmail}, (err, user) => {
            user.isCorrectPassword(currentPassword, (err, same) =>{
                if (err) {
                    //console.log("connection error")
                } else if(!same){
                    //console.log("password error")
                } else if(newPassword !== repeatNewPassword) {
                    //console.log("new password not same")
                } else {
                    //update information without password update
                    user.username = userName,
                    user.firstname = firstName,
                    user.lastname = lastName,
                    user.password = newPassword
                    user.save().then(result => res.send({msg: "success update user info"}))
                }
            })
        })
    }else if(currentPassword !== "" && newPassword !== repeatNewPassword){
        //console.log( "New password and repeat new password must be filled")
    } else {
        //console.log("update data without password update")
        UserAuth.findOne({email: userEmail}, (err, user) => {
            //update information without password update
            user.username = userName,
            user.firstname = firstName,
            user.lastname = lastName
            user.save().then(resp => res.send({msg: "success update user info"}))
        })
    }
})

 module.exports = router;


