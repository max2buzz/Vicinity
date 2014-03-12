PublisherHandler = require('./publisherHandler').PublisherHandler;
var moment = require('moment');

var db = "";

var publisherHandler = "";

exports.setdb = function(datab) {
    db = datab;
    publisherHandler = new PublisherHandler(db);
};


exports.showPubIndex = function(req, res) {
    var serveError = "";

    if (!(req.session.serror === undefined)) {
        serveError = (req.session.serror);
    }
    delete req.session.serror;

    if ((req.session.publisher === undefined)) {
        res.render("publisherIndex", {
            error: serveError
        });
    } else
        res.render('publisherDashboard', {
            publisher: req.session.publisher
        });

};

exports.showPubSignup = function(req, res) {
    res.render("publisherSignup", {
        serverError: ""
    });
};

exports.showPubProfile = function(req, res) {

};


exports.getPost = function(req, res) {

};

exports.createPost = function(req, res) {
    res.render("postCreate", {
        publisher: req.session.publisher
    });
};

exports.editPost = function(req, res) {

};

exports.deletePost = function(req, res) {

};

exports.checkEmail = function(req, res) {

    var email = req.body.emailAdd;

    publisherHandler.getPublisherByEmail(email, function(err, doc) {
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


function getMonthsBySus(type) {
    var map = {
        "Quaterly": 3,
        "Monthly": 1,
        "Yearly": 12
    };

    return map[type];
}


exports.handleLogin = function(req, res) {
    var useremail = req.body.useremail.toLowerCase();
    var password = req.body.password;
    publisherHandler.validateUser(useremail, password, function(err, doc) {
        if (doc) {
            req.session.publisher = doc._id;
            res.redirect("/publisher");
        } else {
            req.session.serror = "Invalid Username and/or password";
            res.redirect("/publisher");
        }
    });
};


exports.handleLogout = function(req, res) {
    if (req.session.publisher === undefined) {

    } else {
        delete req.session.publisher;
    }
    res.redirect("/publisher");

};


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
            req.session.publisher = b.email;
            res.json({
                userAdded: true,
                redirectTo: '/publisher'
            });
        }
    });
};