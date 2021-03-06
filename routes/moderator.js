var ModeratorHandler = require('./moderatorHandler').ModeratorHandler;
var ContentHandler = require('./contenHandler').ContentHandler;
var nodemailer = require("nodemailer");

var generatePassword = require('password-generator');

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Mailgun",
    auth: {
        user: "postmaster@sandbox72544.mailgun.org",
        pass: "monday123"
    }
});



var moment = require('moment');
var db = "";
var moderatorHandler = "";
var contentHandler = "";

exports.setdb = function(datab) {
    db = datab;
    contentHandler = new ContentHandler(db);
    moderatorHandler = new ModeratorHandler(db);
};

exports.showDashboard = function(req, res) {
    contentHandler.getUnmoderatedPosts(function(err, docs) {
        if (err) {
            res.render("moderatorDashboard", {
                moderator: req.session.moderator.name,
                serverError: "Cannot get Documents"
            });
        } else {
            res.render("moderatorDashboard", {
                moderator: req.session.moderator.name,
                posts: docs
            });
        }
    });
};

exports.showModLogin = function(req, res) {
    res.render("moderatorLogin");
};


exports.handleSignUp = function(req, res) {
    res.render("moderatorIndex");
};

exports.postHandle = function(req, res) {
    var id = req.params.id;

    contentHandler.getPostById(id, function(err, doc) {
        if (err) {
            res.render('moderatorPostView', {
                error: "Cannot Retrive Post"
            });
        } else {
            res.render('moderatorPostView', {
                moderator: req.session.moderator,
                post: doc
            });
        }
    });
};

exports.handleLogout = function(req, res) {

};

exports.isModLog = function(req, res, next) {
    if (req.session.moderator === undefined) {
        res.redirect('/moderator/login');
        return;
    }
    next();
};

exports.handleSing = function(req, res) {
    var b = req.body;

    if (b.action === "SIGNUP") {
        var formdata = {
            name: b.fullname,
            email: b.email

        };
        var passgen = generatePassword(8);
        moderatorHandler.findModeratorById(b.email, function(err, doc) {
            console.log("Inside DOc");
            if (doc) {
                var sending = {
                    isValid: false,
                    error: "The Email Address is already registered to the service"
                }
                res.json(sending);
            } else {
                moderatorHandler.insertModerator(b.email, passgen, b.fullname, function(err, doc) {
                    if (err) {
                        res.json(500, {
                            isValid: false,
                            error: "Cannot Proceed, Some Internal Flaws"
                        });
                    } else {
                        var mailOptions = {
                            from: "moderator@vicinityExplorer.com",
                            to: b.email,
                            subject: "Vicinity Explorer Moderator",
                            text: passgen,
                            html: passgen
                        };

                        smtpTransport.sendMail(mailOptions, function(error, response) {
                            if (error) {
                                res.json(500, {
                                    isValid: false,
                                    error: "Cannot Send Email to the above address"
                                });
                            } else {
                                res.json({
                                    isValid: true,
                                    message: "An Email Has been sent to the above address with a pass-key. Use this key to login"
                                });
                            }
                        });


                    }
                });
            }

        });

    }


    if (b.action === "LOGIN") {
        var formdata = {
            email: b.email,
            password: b.pass
        };
        console.log(formdata);
        moderatorHandler.findModeratorById(b.email, function(err, doc) {
            console.log(doc);
            if (doc) {
                if (doc.password === b.pass) {
                    req.session.moderator = doc;
                    res.json({
                        isValid: true,
                        redirectTo: "/moderator"
                    });
                } else {
                    res.json({
                        isValid: false,
                        error: "Username/Password mismatch"
                    });
                }
            } else {
                res.json({
                    isValid: false,
                    error: "Email is not registered to the service"
                });
            }

        });
    }

};

exports.handleLogout = function(req, res) {
    if (req.session.moderator === undefined) {

    } else {
        delete req.session.moderator;
    }
    res.redirect('/moderator');
};

exports.postAccept = function(req, res) {
    var id = req.params.id;
    contentHandler.changeStatus(id, 1, function(err, result) {
        console.log(result);
        if (result > 1) {
            res.json({
                accepted: true
            });
        } else {
            res.json({
                error: true
            });
        }
    });
};

exports.postDeny = function(req, res) {
    var id = req.params.id;
    contentHandler.changeStatus(id, 2, function(err, result) {
        console.log(result);
        if (result > 1) {
            res.json({
                deny: true
            });
        } else {
            res.json({
                error: true
            });
        }
    });
};




exports.getModeratorCount = function(req, res) {

};