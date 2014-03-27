var user = require('./user');
var content = require('./content');
var publisher = require('./publisher');
var moderator = require('./moderator');

module.exports = exports = function(app, db) {

    user.setdb(db);
    publisher.setdb(db);
    moderator.setdb(db);

    //User Routes
    app.get('/', content.showIndexPage);
    app.get('/signup', user.showSignUpPage);
    app.get('/user', user.showUserDashboard);
    app.get("/user/logout", user.handleLogout);
    app.get('/user/u/:name', user.showUserProfile);
    app.get('/user/p/:id', user.getPost);

    app.post("/newUserEmail", user.checkEmail);
    app.post('/newUserName', user.checkUserName);
    app.post("/signUpUser", user.handleSignUp);
    app.post("/user/login", user.handleLogin);


    // Publisher Routes
    app.get('/publisher', publisher.showPubIndex);
    app.get('/publisher/signup', publisher.showPubSignup);
    app.get('/publisher/logout', publisher.handleLogout);
    app.get('/publisher/p/new', publisher.isPubLog, publisher.createPost);
    app.get('/publisher/p/:id', publisher.isPubLog, publisher.getPost);
    app.get('/publisher/p/:id/edit', publisher.isPubLog, publisher.editPost);

    app.post('/signUpPublisher', publisher.handleSignUp);
    app.post("/newPublisherEmail", publisher.checkEmail);
    app.post('/publisher/login', publisher.handleLogin);
    app.post('/publisher/p/publish', publisher.handlePostSubmission);


    //Moderator Routes
    app.get('/moderator', moderator.showDashboard);
    app.get('/moderator/login', moderator.showModLogin);
    app.get('/moderator/signup', moderator.handleSignUp);
    app.get('/moderator/p/:id', moderator.isModLog, moderator.postHandle);
    app.get('/moderator/logout', moderator.isModLog, moderator.handleLogout);

    app.post('/moderatorSign', moderator.handleSing);

};