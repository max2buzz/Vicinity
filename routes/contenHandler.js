function ContentHandler(db) {

    var posts = db.collection("Post");

    if (false === (this instanceof ContentHandler)) {
        console.log('Warning: PublisherDAO constructor called without "new" operator');
        return new ContentHandler(db);
    }


    this.publishPost = function(post, callback) {
        posts.insert(post, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(result);
            }
        });
    };

    this.getPostByLocation = function(loc, callback) {
        var query = {
            location: loc
        };

        posts.find(query).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, docs);
            }

        });


    };


}
module.exports.ContentHandler = ContentHandler;