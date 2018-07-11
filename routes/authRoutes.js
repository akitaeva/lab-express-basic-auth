const express    = require('express')
const userRouter = express.Router();
const User       = require('../models/userModel');
const bcrypt     = require('bcryptjs');

userRouter.get('/signup', (req, res, next)=> {
    res.render('signupPage');
});

userRouter.get('/success', (req, res, next)=> {
    res.render('success');
});

userRouter.get('/successli', (req, res, next)=> {
    res.render('successLI');
});

userRouter.post('/signup', (req, res, next) =>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    if (thePassword === "" || theUsername === "") {
        res.render('signupPage', {errorMessage: "Please fill in the fields for Username and Password"})
        return;
    }
    
    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if (responseFromDB !== null){
            res.render('signupPage', {errorMessage: `You cannot have the username ${theUsername}, it's been taken `})
            return;
        }
        const salt           = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(thePassword, salt);
        
        User.create({username: theUsername, password: hashedPassword})
        .then((response)=> {
            res.redirect('/success');
        
        })
        .catch(err => {
            next(err)
        });
        
    })

});

userRouter.get('/login', (req, res, next) => {
    res.render('loginPage');
});

userRouter.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    console.log(theUsername, '=========== ', thePassword)

    if (theUsername === "" || thePassword === "") {
        res.render("loginPage", {errorMessage: "Indicate a username and a password to sign up"});
        return;
      }
    
  
    User.findOne({ "username": theUsername }, (err, user) => {
        if (err || !user) {
          res.render("loginPage", {errorMessage: "The username doesn't exist"});
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/successLI");
        } else {
          res.render("loginPage", {errorMessage: "Incorrect password"});
        }
    });
});


userRouter.get('/logout', (req, res, next) => {
req.session.destroy((err) => {
    res.redirect('/login')

   });

});



module.exports = userRouter;