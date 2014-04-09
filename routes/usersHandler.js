function UsersHandler(db) {
    "use strict";

    var users = db.collection("Users");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UsersHandler)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersHandler(db);
    }

    this.getUserByEmail = function(email, callback) {
        "use strict";

        var query = {
            _id: email
        };

        users.findOne(query, function(err, doc) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, doc);
            }
        });
    }


    this.validateUser = function(username, password, callback) {
        var query = {
            userName: username
        };
        console.log("In Validate User");
        users.findOne(query, function(err, doc) {
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


    this.getUserByUserName = function(username, callback) {

        var query = {
            userName: username
        };


        users.findOne(query, function(err, doc) {
            if (err) {
                return callback(null, null);
            } else {
                return callback(null, doc);
            }
        });
    }


    this.getUsersByLocation = function(locationId, num, callback) {
        var query = {
            locationId: locationId
        };

        users.find(query).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, docs);
            }

        });
    }

    this.addUser = function(user, callback) {
        users.insert(user, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(null);
            }
        });
    };






}

module.exports.UsersHandler = UsersHandler;