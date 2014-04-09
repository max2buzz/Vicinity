exports.showIndexPage = function(req, res) {
    var serveError = "";

    if (!(req.session.serror === undefined)) {
        serveError = (req.session.serror);
    }
    delete req.session.serror;

    res.render("index", {
        error: serveError
    });

};

exports.showAboutPage = function(req, res) {
	res.render('about');

};

exports.showContactPage = function(req, res) {
	res.render('contact');

};


exports.getPostsCount = function(req, res) {

};

exports.getPostByTag = function(req, res) {
    
};