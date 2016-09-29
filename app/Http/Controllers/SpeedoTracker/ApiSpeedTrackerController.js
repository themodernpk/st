'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");
const StSpeedTracking = use("App/Model/SpeedoTracker/StSpeedTracking");

var data = {};
var result = {};
var user = new User();
var token = new Token();
var tracking = new StSpeedTracking();

class ApiSpeedTrackerController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *sync(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help')) {
            result ={
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    core_user_id: "required | user id ",
                    lat: "required | latitude",
                    lng: "required | longitude",
                    speed: "required | speed of the user numeric value",
                    unit: "required | unit of the speed. example: km/h or miles/h",
                    created_by: "optional | User id of the user who is creating the recode",
                    created_at: "optional | Date and time in YYYY-MM-DD HH:ii:ss format",
                }
            };
            return response.json(result);
        }

        if (typeof data.input.created_by === 'undefined'){
            user = yield api.getUser();
            data.input.created_by = user.id;
        }

        result = yield tracking.createItem(data.input);
        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiSpeedTrackerController;
