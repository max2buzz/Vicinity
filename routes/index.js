var user = require('./user');
var content = require('./content');
var publisher = require('./publisher');

module.exports = exports = function(app, db) {

	//User Routes
	app.get('/', content.showIndexPage );
	app.get('/signup', user.showSignUpPage );
	app.get('/user', user.showUserDashboard );
	app.get('/user/:name', user.showUserProfile);
	app.get('/user/p/:id' ,user.getPost);

	app.post("/newUserEmail",user.checkEmail);
	app.post('/newUserName', user.checkUserName );
	


	// Publisher Routes
	app.get('/publisher', publisher.showPubIndex);
	
}

