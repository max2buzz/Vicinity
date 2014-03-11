UsersHandler = require('./usersHandler').UsersHandler;
var moment = require('moment');

var db = "";

var userHandler = "";

exports.setdb = function(datab) {
    db = datab;
    userHandler = new UsersHandler(db);
};

exports.list = function(req, res) {
    res.send("respond with a resource");
};


exports.showSignUpPage = function(req, res) {
    res.render("userSignup", {
        serverError: ""
    });
};

exports.showUserDashboard = function(req, res) {
    if ((req.session.user === undefined))
        res.redirect("/");
    else
        res.render('userDashboard', {
            user: req.session.user
        });

};


exports.showUserProfile = function(req, res) {

};

exports.getPost = function(req, res) {

};

exports.handleSignUp = function(req, res) {
    var b = req.body;
    var user = {
        _id: b.email.toLowerCase(),
        userName: b.username.toLowerCase(),
        password: b.password,
        name: b.name,
        gender: b.gender,
        locationId: b.location,
        joinedAtkey: moment().format()
    };

    userHandler.addUser(user, function(err) {
        if (err) {
            console.log("PROBLEM ADDING USER");
            res.json({
                userAdded: false
            });

        } else {
            req.session.user = b.username;
            res.json({
                userAdded: true,
                redirectTo: '/user'
            });
        }

    });
};


exports.handleLogin = function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    userHandler.validateUser(username, password, function(err, doc) {
        if (doc) {
            req.session.user = username;
            res.redirect("/user");
        } else {
            req.session.serror = "Invalid Username and/or password";
            res.redirect("/");
        }
    });
};

exports.handleLogout = function(req, res) {
    console.log(req.session.user);
    if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        delete req.session.user;
        console.log(req.session.user);
        res.redirect("/");
    }

};


exports.checkEmail = function(req, res) {

    var email = req.body.emailAdd;

    userHandler.getUserByEmail(email, function(err, doc) {
        if (doc) {
            res.json({
                isAvail: false,
                isValid: true
            });
        } else {
            res.json({
                isAvail: true,
                isValid: true
            });
        }

    });

};

exports.checkUserName = function(req, res) {

    var username = req.body.userName;


    userHandler.getUserByUserName(username, function(err, doc) {
        if (doc) {
            res.json({
                isAvail: false,
                isValid: true
            });
        } else {
            res.json({
                isAvail: true,
                isValid: true
            });
        }

    });
};