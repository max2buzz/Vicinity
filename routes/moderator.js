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

var mailOptions = {
    from: "moderator@vicinityExplorer.com", // sender address
    to: "shrikarz@gmail.com , aniketsakinala@gmail.com, maxbuzzer92@gmail.com", // list of receivers
    subject: "Application Sent Mail", // Subject line
    text: "I Have sent this Mail from the Application not from  Inbox ... Testing Time .. Reply if u get it ", // plaintext body
    html: "<b>I Have sent this Mail from the Application not from  Inbox ... Testing Time .. Reply if u get it </b>", // html body

};

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
    res.send("Done Here");
};

exports.showModLogin = function(req, res) {
    res.render("moderatorLogin");
};


exports.handleSignUp = function(req, res) {
    res.render("moderatorIndex");
};

exports.postHandle = function(req, res) {

};

exports.handleLogout = function(req, res) {

};

exports.isModLog = function(req, res) {

};

exports.handleSing = function(req, res) {
    var b = req.body;
    console.log(b);
    if (b.action === "SIGNUP") {
        var formdata = {
            name: b.fullname,
            email: b.email

        };
        var passgen = generatePassword(8);
        contenHandler.findModeratorById(b.email, function(err, doc) {
            if (doc) {
                var sending = {
                    isValid: false,
                    error: "The Email Address is already registered to the service"
                };
            }

        });

    }
    if (b.action === "LOGIN") {
        var formdata = {
            email: b.email,
            password: b.pass
        };
        console.log(formdata);
    }

};