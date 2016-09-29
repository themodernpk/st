'use strict';
const Validator = use('Validator');
const User = use("App/Model/Niddar/User");

var result = {};

class StUser extends User {

    //---------------------------------------------
    trackers() {
        return this.hasMany('App/Model/SpeedoTracker/StTracker', 'id', 'core_user_id')
    }
    //---------------------------------------------

}
module.exports = StUser
