function BookHandler(db) {
    "use strict";

    var books = db.collection("Book");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof BookHandler)) {
        console.log('Warning: ModeratorDAO constructor called without "new" operator');
        return new BookHandler(db);
    }

    this.addBook = function(book, callback) {
    	console.log("Inside Add Book");
    	console.log(book)
    	books.insert(book, function(err, result) {
    		if (err) {
    			return callback(err, null);
    		} 
    		else
    		{
    			return callback(null, result);
    		}
    	});

    };

    this.getBooksByLocation = function(loc , callback) {
        var query = {
            locationId: loc
        };

        books.find(query).sort({
            createdAt: -1
        }).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, docs);
            }

        });


    };



}

module.exports.BookHandler = BookHandler;