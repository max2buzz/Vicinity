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
        moderatorHandler.findModeratorById(b.email, function(err, doc) {
            if (doc) {
                var sending = {
                    isValid: false,
                    error: "The Email Address is already registered to the service"
                };
            }
            else{
                moderatorHandler.insertModerator(b.email, passgen, b.fullname , function(err, doc) {
                    if(err){
                        res.json(500, {isValid:false, error:"Cannot Proceed, Some Internal Flaws"});
                    }
                    else{
                        var mailOptions = {
                            from: "moderator@vicinityExplorer.com",
                            to: b.email,
                            subject: "Vicinity Explorer Moderator",
                            text: "Passkey for your Account is "+ passgen,
                            html: "Passkey for your Account is "+ passgen
                        };

                        smtpTransport.sendMail(mailOptions, function(error, response){
                            if(error){
                                res.json(500, {isValid:false, error:"Cannot Send Email to the above address"});
                            }
                            else{
                                res.json({isValid:true, message:"An Email Has been sent to the above address with a pass-key. Use this key to login"});
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
    }

};