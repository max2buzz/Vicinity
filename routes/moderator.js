ModeratorHandler = require('./moderatorHandler').ModeratorHandler;
ContentHandler = require('./contenHandler').ContentHandler;
var nodemailer = require("nodemailer");

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
    attachments: [{ // utf-8 string as an attachment
        fileName: "ImageFromServer.jpg",
        filePath: "public/images/alone.jpg"
    }, { // file on disk as an attachment
        fileName: "text3.txt",
        filePath: "public/images/cassy.txt" // stream this file
    }]
};

var moment = require('moment');

var db = "";
var publisherHandler = "";
var contentHandler = "";

exports.setdb = function(datab) {
    db = datab;
    contentHandler = new ContentHandler(db);
    moderatorHandler = new ModeratorHandler(db);
};

exports.showIndexPage = function(req, res) {
    res.render("moderatorIndex");
};

exports.showModSignUp = function(req, res) {
    res.render("moderatorLogin");
};


exports.handleSignUp = function(req, res) {
    res.render("moderatorSignUp");
};


exports.postHandle = function(req, res) {

};

exports.handleLogout = function(req, res) {

};

exports.isModLog = function(req, res) {

};