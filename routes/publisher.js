PublisherHandler = require('./publisherHandler').PublisherHandler;
ContentHandler = require('./contenHandler').ContentHandler;

var moment = require('moment');

var db = "";
var publisherHandler = "";
var contentHandler = "";

exports.setdb = function(datab) {
    db = datab;
    contentHandler = new ContentHandler(db);
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
    } else {
        contentHandler.getPostsByPublisher(req.session.publisherd.OrganizationName, function(err, docs) {
            res.render('publisherDashboard', {
                publisher: req.session.publisherd.OrganizationName,
                posts: docs
            });
        });
    }
};

exports.showPubSignup = function(req, res) {
    res.render("publisherSignup", {
        serverError: ""
    });
};

exports.showPubProfile = function(req, res) {
    
};





exports.getPost = function(req, res) {
    contentHandler.getPostById(req.params.id, function(err, doc) {

        if (doc) {
            res.render('publisherPostView', {
                publisher: req.session.publisherd.OrganizationName,
                title: doc.title,
                body: doc.body,
                tags: doc.tags,
                publishedAt: doc.publishedAt,

            });
        } else {
            res.render('userPostView', {
                error: "Error Getting Post"
            });
        }
    });
};

exports.isPubLog = function(req, res, next) {
    if (req.session.publisher === undefined) {
        return res.redirect('/publisher');
    } else {
        next();
    }
};

exports.createPost = function(req, res) {
    res.render("postCreate", {
        publisher: req.session.publisherd.organizationName
    });
};

exports.editPost = function(req, res) {

};

exports.deletePost = function(req, res) {

};


exports.handlePostSubmission = function(req, res) {
    var currentPub = req.session.publisherd;

    var b = req.body;

    var post = {
        title: b.title,
        body: b.body,
        tags: b.tags,
        location: b.location,
        publishedBy: currentPub.OrganizationName,
        publishedAt: moment().format(),
        status: 0,
        userComments: [],
        moderatorComments: []
    };

    contentHandler.publishPost(post, function(doc) {
        if (doc) {
            res.json({
                posted: true,
                id: doc._id
            });
        } else {
            res.json({
                posted: false,
                id: doc._id
            });
        }
    });


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
            req.session.publisherd = doc;
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
        delete req.session.publisherd;
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
            res.json({
                userAdded: false
            });

        } else {
            req.session.publisher = b.email;
            req.session.publisherd = publisher;
            res.json({
                userAdded: true,
                redirectTo: '/publisher'
            });
        }
    });
};


exports.getPublisherCount = function(req, res) {
    publisherHandler.getPubCount(function(err, count) {
        if(err){
            res.json(500, {error:'N/A'});
        }
        else{
            res.json({
                number:count
            });
        }
    });
};