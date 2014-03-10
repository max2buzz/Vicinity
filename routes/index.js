var user = require('./user');
var content = require('./content');
var publisher = require('./publisher');

module.exports = exports = function(app, db) {

    user.setdb(db);
    publisher.setdb(db);

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
    app.get('/publisher/p/new', publisher.createPost);
    app.get('/publisher/p/:id', publisher.getPost);
    app.get('/publisher/p/:id/edit', publisher.editPost);

    app.post('/signUpPublisher', publisher.handleSignUp);

};