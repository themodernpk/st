'use strict'
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");
const StToken = use("App/Model/SpeedoTracker/StToken");
const StUser = use("App/Model/SpeedoTracker/StUser");

var data = {};
var result = {};
class ApiStUserController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *users(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help')) {
            result ={
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    token: "required | user token ",
                }
            };
            return response.json(result);
        }
        var users = yield StUser.all();

        return response.json(users);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiStUserController;
