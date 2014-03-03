var user = require('./user');
var content = require('./content');
var publisher = require('./publisher');

module.exports = exports = function(app, db) {

	//User Routes
	app.get('/', content.showIndexPage );
	app.get('/signUp', user.showSignUpPage );
	app.get('/user', user.showUserDashboard );
	app.get('/user/:name', user.showUserProfile);
	app.get('/user/p/:id' ,user.getPost);

	// Publisher Routes
	app.get('/publisher', publisher.showPubIndex);
	
}

