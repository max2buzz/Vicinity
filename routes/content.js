exports.showIndexPage = function(req, res) {
    console.log("HERE AT index");

    var serveError = "";

    if (!(req.session.serror === undefined)) {
        serveError = (req.session.serror);
    }
    delete req.session.serror;

    res.render("index", {
        error: serveError
    });

};


exports.getPost = function(req, res) {

};