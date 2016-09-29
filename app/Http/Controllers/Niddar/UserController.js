'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Setting = use("App/Model/Niddar/Setting");
const Permission = use("App/Model/Niddar/Permission");
const Route = use('Route');

var view = Niddar.settings.backendThemePath() + "/permission";
var data = {};
var result = {};
var permission = new Permission();

class UserController {
//---------------------------------------------------------
//---------------------------------------------------------
    *index(request, response) {
        data.input = request.all();
        data.params = request.params();
        data.title = Niddar.info.appName();
        data.bodyClass = "";
        return yield response.sendView(view + "/index", {data});
    }


    //---------------------------------------------------------
} //end of class
module.exports = UserController;
