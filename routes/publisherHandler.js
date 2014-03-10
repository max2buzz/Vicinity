function PublisherHandler(db) {
    "use strict";

    var publishers = db.collection("Publisher");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PublisherHandler)) {
        console.log('Warning: PublisherDAO constructor called without "new" operator');
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



}


module.exports.PublisherHandler = PublisherHandler;