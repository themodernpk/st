'use strict'
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");
const StToken = use("App/Model/SpeedoTracker/StToken");
const StUserSetting = use("App/Model/SpeedoTracker/StUserSetting");
const StUser = use("App/Model/SpeedoTracker/StUser");

var data = {};
var result = {};
class ApiStSettingController {
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
                    token: "required | user token ",
                    key: "required | slug  like status etc",
                    label: "required | human readable text",
                    value: "required | value of the key",
                }
            };
            return response.json(result);
        }
        data.input.user = yield api.getUser();

        if(data.input.user)
        {
            data.input.core_user_id = data.input.user.id;
        } else
        {
            result = {
                status: "failed",
                errors: [{message: "user not found"}]
            }
            return response.json(result);
        }

        var stUserSetting = new StUserSetting;
        result = yield stUserSetting.set(data.input);

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
                    token: "required | user token ",
                    key: "required | slug  like status etc",
                    label: "required | human readable text",
                    value: "required | value of the key",
                }
            };
            return response.json(result);
        }
        data.input.user = yield api.getUser();

        if(data.input.user)
        {
            data.input.core_user_id = data.input.user.id;
        } else
        {
            result = {
                status: "failed",
                errors: [{message: "user not found"}]
            }
            return response.json(result);
        }

        var stUserSetting = new StUserSetting;
        result = yield stUserSetting.get(data.input);
        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiStSettingController;
