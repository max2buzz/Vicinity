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

        posts.find(query).sort({
            publishedAt: -1
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, docs);
            }

        });


    };

    this.getPostById = function(id, callback) {
        var query = {
            _id: new require('mongodb').ObjectID(id)
        };

        posts.findOne(query, function(err,doc) {
            if(doc){
                return callback(null,doc);
            }
            if(err){
                throw err;
            }

        });
    };


    this.getCommentsFromPost = function(id,callback) {
        var query = {
            _id: new require('mongodb').ObjectID(id)
        };

        posts.findOne(query, function(err,doc) {
            if(doc){
                return callback(null,doc.userComments);
            }
            if(err){
                return callback(err, null);
            }

        });
    };

    this.addCommentFromUser = function(id, comment, callback) {
        var query = {
            _id: new require('mongodb').ObjectID(id)
        };

        posts.update(query , {
            $push: {userComments: comment}
        }, function(err, result) {
            if(err){
                return callback(err, null);
            }
            else return callback(null, result);
        });
    };

    this.getPostsByPublisher=function(publisherName, callback){
        var query={
            publishedBy:publisherName
        };

        posts.find(query).sort({
            publishedAt: -1
        }).toArray(function (err,docs){
            if(err){
                return callback(err, null);
            }
            else{
                return callback(null, docs);
            }
        });
    };

    this.getUnmoderatedPosts=function(callback){
        var query={
            status: 0
        }
        posts.find(query).toArray(function(err,docs){
            if(err){
                return callback(err, null);
            }
            else{
                return callback(null, docs);
            }
        });
    };
    

}
module.exports.ContentHandler = ContentHandler;