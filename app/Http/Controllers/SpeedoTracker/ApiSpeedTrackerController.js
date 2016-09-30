'use strict'
const Moment = use("moment");
const Database = use("Database");
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Token = use("App/Model/Niddar/Token");
const Validator = use('Validator');
const Setting = use("App/Model/Niddar/Setting");
const StTracker = use("App/Model/SpeedoTracker/StTracker");
const StToken = use("App/Model/SpeedoTracker/StToken");
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
    *history(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help')) {
            result ={
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    core_user_token: "required | user token ",
                    start: "optional | start date",
                    end: "optional | end date",
                }
            };
            return response.json(result);
        }

        //..............validation
        var rule = {
          core_user_token: "required"
        };
        const validation = yield Validator.validateAll(data.input, rule);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return response.json(result);
        }


        //current user
        user = yield api.getUser();
        var target_user_token = yield StToken.findBy("token", data.input.core_user_token);
        if(!target_user_token)
        {
            result = {
                status: "failed",
                errors: [{message: "user does not exist"}]
            };
            return response.json(result);
        }
        var target_user = yield target_user_token.user().first();

        //check current user is authorized to get the history
        var tracking = yield StTracker.query()
            .where('core_user_id', target_user.id)
            .where('tracker_user_id', user.id)
            .first();

        if(!tracking)
        {
            result = {
                status: "failed",
                errors: [{message: "you're not authorize"}]
            };
            return response.json(result);
        }

        var dateFormitted = Moment().format('YYYY-MM-DD');

        //find history

            if (typeof data.input.start === 'undefined' || typeof data.input.end === 'undefined')
            {
                var history = yield StSpeedTracking.query()
                    .where("core_user_id", target_user.id)
                    .whereRaw('DATE(created_at) = ?', [dateFormitted]);
            }  else
            {
                var history = StSpeedTracking.query();
                history.where("core_user_id", target_user.id);

                if (data.input.hasOwnProperty('start')) {
                    history.whereRaw('DATE(created_at) >= ?', [data.input.start])
                }
                if (data.input.hasOwnProperty('end')) {
                    history.whereRaw('DATE(created_at) <= ?', [data.input.end])
                }
                var history = yield history.fetch();
            }

            result = {
                status: "success",
                data: history
            };


        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiSpeedTrackerController;
