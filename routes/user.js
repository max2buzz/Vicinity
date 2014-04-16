var UsersHandler = require('./usersHandler').UsersHandler;
var ContentHandler = require('./contenHandler').ContentHandler;
var BookHandler = require('./bookHandler').BookHandler;
var moment = require('moment');
var downsize = require('downsize');

var db = "";

var userHandler = "";
var contentHandler = "";
var bookHandler = "";

exports.setdb = function(datab) {
    db = datab;
    userHandler = new UsersHandler(db);
    bookHandler = new BookHandler(db);
    contentHandler = new ContentHandler(db);
};

exports.showSignUpPage = function(req, res) {
    res.render("userSignup", {
        serverError: ""
    });
};


exports.showUserDashboard = function(req, res) {
    if ((req.session.user === undefined))
        res.redirect("/");
    contentHandler.getPostByLocation(req.session.userloc, function(err, docs) {
        if (docs) {

            res.render('userDashboard', {
                loc: req.session.userloc,
                user: req.session.user,
                posts: docs

            });
        } else {
            res.render('userDashboard', {
                loc: req.session.userloc,
                user: req.session.user,
                posts: null,
                error: "Contents Cannot Be Retrived From Server"
            });
        }
    });

};

exports.isUserLog = function(req, res, next) {

    if (req.session.user === undefined) {
        return res.redirect('/');
    } else {
        next();
    }
};

exports.showUserProfile = function(req, res) {

};

exports.getPost = function(req, res) {

    contentHandler.getPostById(req.params.id, function(err, doc) {

        if (doc) {
            res.render('userPostView', {
                user: req.session.user,
                title: doc.title,
                body: doc.body,
                tags: doc.tags,
                publishedAt: doc.publishedAt,
                publishedBy: doc.publishedBy,
            });
        } else {
            res.render('userPostView', {
                error: "Error Getting Post"
            });
        }
    });
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
        joinedAtkey: moment().format(),
        lastLogIn: moment().format()
    };

    userHandler.addUser(user, function(err) {
        if (err) {
            console.log("PROBLEM ADDING USER");
            res.json({
                userAdded: false
            });

        } else {
            req.session.user = b.username;
            req.session.userloc = b.location;
            req.session.userO = user;
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
            req.session.userO = doc;
            req.session.userloc = doc.locationId;
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
        delete req.session.userO;
        delete req.session.userloc;
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


exports.getCommentsFromPost = function(req, res) {

    var id = req.params.id;

    contentHandler.getCommentsFromPost(id, function(err, comments) {
        if (err) {
            res.json(500, {
                error: "Cannot Fetch Comments"
            });
        } else {
            res.json(comments);
        }
    });

};

exports.getBidsFromBook = function(req, res) {

    var id = req.params.id;

    bookHandler.getBidsFromBook(id, function(err, comments) {
        if (err) {
            res.json(500, {
                error: "Cannot Fetch Comments"
            });
        } else {
            res.json(comments);
        }
    });

};



exports.addCommentToPost = function(req, res) {
    console.log("In Comments");
    var id = req.params.id;
    var comment = {
        user: req.session.userO.name,
        body: req.body.commentbody,
        postedAt: moment().format()
    };

    contentHandler.addCommentFromUser(id, comment, function(err, result) {
        if (err) {
            res.json(500, {
                error: "Some Error Posting Comment"
            });
            return;
        }
        if (result) {
            res.json(comment);
            return;
        }
        res.json(500, {
            error: "Some Error Posting Comment"
        });
    });


};

exports.addBidToBook = function(req, res) {
    var id = req.params.id;
    var comment = {
        user: req.session.userO.name,
        bookName : req.body.book,
        body: req.body.bidText,
        postedAt: moment().format()
    };
    bookHandler.addBidToBook(id, comment, function(err, result) {
        if (err) {
            res.json(500, {
                error: "Some Error Posting Comment"
            });
            return;
        }
        if (result) {
            res.json(comment);
            return;
        }
        res.json(500, {
            error: "Some Error Posting Comment"
        });
    });


};






exports.showBookDashboard = function(req, res) {

    bookHandler.getBooksByLocation(req.session.userO.locationId, function(err, docs) {
        res.render('userBookDashboard', {
            user: req.session.userO._id,
            loc: req.session.userO.locationId,
            books: docs
        });
    });
};


exports.getBook = function(req, res) {
    var bookId = req.params.id;
    bookHandler.getBookById(bookId, function(err, results) {
        res.render('userBookView', {
            user: req.session.user,
            book: results
        });
    });
};

exports.addNewBook = function(req, res) {
    res.render("userBookAdd", {});
};


exports.handleBookPost = function(req, res) {

    var b = req.body;
    var book = {
        title: b.title,
        author: b.author,
        amazonLink: b.amazon,
        description: b.describe,
        imageLink: b.imageLink,
        tags: b.tags.split(","),
        tradeWith: b.intended.split(","),
        createdAt: moment().format(),
        bids: [],
        locationId: req.session.userO.locationId,
        user: req.session.userO
    };

    bookHandler.addBook(book, function(err, bookR) {
        if (err) {
            res.redirect('/user/');
        } else {
            res.redirect('/user/books');
        }
    });
};




exports.getUsersCount = function(req, res) {

};