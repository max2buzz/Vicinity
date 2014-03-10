PublisherHandler = require('./publisherHandler').PublisherHandler;
var moment = require('moment');

var db = "";

var publisherHandler = "";

exports.setdb = function(datab) {
    db = datab;
    publisherHandler = new PublisherHandler(db);
};


exports.showPubIndex = function(req, res) {
    res.send("GREAT WORK");
};

exports.showPubSignup = function(req, res) {
    res.render("publisherSignup", {
        serverError: ""
    });
};

exports.showPubDash = function(req, res) {

};

exports.showPubProfile = function(req, res) {

};


exports.getPost = function(req, res) {

};

exports.createPost = function(req, res) {

};

exports.editPost = function(req, res) {

};

exports.deletePost = function(req, res) {

};


function getMonthsBySus(type) {
    var map = {
        "Quaterly": 3,
        "Monthly": 1,
        "Yearly": 12
    };

    return map[type];
}

exports.handleSignUp = function(req, res) {
    var b = req.body;
    var emailid = b.email;
    var numMonths = getMonthsBySus(b.subscription);
    var publisher = {
        _id: b.email.toLowerCase(),
        username: emailid.substring(0, emailid.indexOf("@")),
        OrganizationName: b.organizationName,
        password: b.password,
        subscriptionType: b.subscription,
        subscriptionStart: moment().format(),
        subscriptionEnd: moment().add("M", numMonths).format(),
        joinedAtkey: moment().format()
    };

    publisherHandler.addPublisher(publisher, function(err, doc) {
        if (err) {
            console.log("PROBLEM ADDING USER");
            res.json({
                userAdded: false
            });

        } else {
            req.session.publisher = b.username;
            res.json({
                userAdded: true,
                redirectTo: '/publisher'
            });
        }
    });


};