module.exports.ModeratorHandler = ModeratorHandler;

function ModeratorHandler(db) {
    "use strict";

    var moderators = db.collection("Moderator");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ModeratorHandler)) {
        console.log('Warning: ModeratorDAO constructor called without "new" operator');
        return new ModeratorHandler(db);
    }


    this.insertModerator= function(email, password, name, callback){

    };

    this.findModeratorById = function(email, callback) {

    };

    

}