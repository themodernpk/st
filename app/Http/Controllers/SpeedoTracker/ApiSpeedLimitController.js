'use strict'
const Niddar = use("App/Niddar");
const StUser = use("App/Model/SpeedoTracker/StUser");
const StToken = use("App/Model/SpeedoTracker/StToken");
const StSpeedLimit = use("App/Model/SpeedoTracker/StSpeedLimit");
const Setting = use("App/Model/Niddar/Setting");
const Validator = use('Validator');


var data = {};
var result = {};
var user = new StUser();
var stSpeedLimit = new StSpeedLimit();



class ApiSpeedLimitController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *set(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help')) {
            result ={
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    core_user_token: "required | token of the user for whom the limit is going to be set ",
                    allocated_at: "required | date time in YYYY-MM-DD H:i:s format",
                    speed: "required | speed limit should be a number",
                    unit: "required | km/h or mi/h",
                }
            };
            return response.json(result);
        }

        //validation
        var rules = {
            core_user_token: "required",
            allocated_at: "required",
            speed: "required",
            unit: "required",
        };

        const validation = yield Validator.validateAll(data.input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        user = yield api.getUser();
        if (typeof data.input.created_by === 'undefined')
        {
            data.input.allocated_by = user.id;
            data.input.created_by = user.id;
        }

        var speed_limit_user_token = yield StToken.findBy('token', data.input.core_user_token);
        data.input.core_user_id =  speed_limit_user_token.user_id;

        result = yield stSpeedLimit.createItem(data.input);
        return response.json(result);
    }
    //---------------------------------------------------------
    *get(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help')) {
            result ={
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    core_user_token: "required | token of the user for whom the limit is going to be set ",
                    from: "optional | from date",
                    to: "optional | to date",
                }
            };
            return response.json(result);
        }

        //validation
        var rules = {
            core_user_token: "required",
        };

        const validation = yield Validator.validateAll(data.input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        user = yield api.getUser();

        var speed_limit_user_token = yield StToken.findBy('token', data.input.core_user_token);
        var speed = yield StSpeedLimit.query().where('core_user_id', speed_limit_user_token.user_id)
            .where("allocated_by", user.id).first();

        result = {
            status: "success",
            data: speed
        };


        return response.json(result);
    }
    //---------------------------------------------------------
    //---------------------------------------------------------
} //end of class
module.exports = ApiSpeedLimitController;
