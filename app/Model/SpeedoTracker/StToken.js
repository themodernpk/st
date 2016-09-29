'use strict';
const Validator = use('Validator');
const Token = use("App/Model/Niddar/Token");

var result = {};

class StToken extends Token {

    //---------------------------------------------
    user() {
        return this.belongsTo('App/Model/SpeedoTracker/StUser', 'id', 'user_id');
    }
    //---------------------------------------------

}
module.exports = StToken
