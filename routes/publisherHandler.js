function PublisherHandler(db) {
    "use strict";

    var publishers = db.collection("Publisher");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PublisherHandler)) {
        console.log('Warning: ModeratorDAO constructor called without "new" operator');
        return new PublisherHandler(db);
    }

    this.addPublisher = function(publisher, callback) {

        publishers.insert(publisher, function(err, result) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        });
    };


    this.getPublisherByEmail = function(email, callback) {


        var query = {
            _id: email
        };

        publishers.findOne(query, function(err, doc) {
            console.log(doc);
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, doc);
            }
        });
    };

    this.validateUser = function(useremail, password, callback) {
        var query = {
            _id: useremail
        };

        publishers.findOne(query, function(err, doc) {
            if (err) {
                return callback(err, null);
            } else {
                if (doc && doc.password == password) {
                    return callback(null, doc);
                } else {
                    return callback("10110", null);
                }

            }

        });
    };



}
module.exports.PublisherHandler = PublisherHandler;