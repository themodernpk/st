'use strict'
const Lucid = use('Lucid');
const Validator = use('Validator');
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");
const table = "st_user_settings";
var result = {};
class StUserSetting extends Lucid {

    //---------------------------------------------
    static get table() {
        return table;
    }

    //---------------------------------------------
    static get deleteTimestamp() {
        return null
    }

    //---------------------------------------------
    static get dateFormat() {
        return 'YYYY-MM-DD HH:mm:ss'
    }
    //---------------------------------------------
    user() {
        return this.belongsTo('App/Model/Niddar/User')
    }
    //---------------------------------------------
    //---------------------------------------------
    //---------------------------------------------
}
module.exports = StUserSetting
