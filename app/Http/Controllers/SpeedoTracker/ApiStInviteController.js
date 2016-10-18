'use strict'
const Niddar = use("App/Niddar");
const Validator = use('Validator');
const User = use("App/Model/Niddar/User");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");
const StTracker = use("App/Model/SpeedoTracker/StTracker");
const StUser = use("App/Model/SpeedoTracker/StUser");
const StInvite = use("App/Model/SpeedoTracker/StInvite");
var data = {};
var result = {};
var user = new User();
var token = new Token();

class ApiStInviteController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *invite(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');

        if (data.input.hasOwnProperty('help'))
        {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    name: "required | ",
                    email: "email or mobile must be set",
                    mobile: "email or mobile must be set",
                    message: "required | message",
                    token: "required | token of the user",
                }
            };
            return response.json(result);
        }

        if (typeof data.input.mobile === 'undefined' && typeof data.input.email === 'undefined')
        {
            result = {
                status: "failed",
                errors: [{message: "you must pass email or mobile number of the user"}]
            };
            return response.json(result);
        }

        //validation
        var rules = {
            name: "required",
            message: "required",
        };

        const validation = yield Validator.validateAll(data.input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return response.json(result);
        }


        //check if user is already registered
        if (data.input.hasOwnProperty('email')) {
            var exist = yield StUser.findBy("email", data.input.email);

            if(exist)
            {
                result = {
                    status: "failed",
                    errors: [{message: "This email is already registered"}]
                }
                return response.json(result);
            }

        }


        if (data.input.hasOwnProperty('mobile')) {
            var exist = yield StUser.findBy("mobile", data.input.mobile);

            if(exist)
            {
                result = {
                    status: "failed",
                    errors: [{message: "This mobile is already registered"}]
                }
                return response.json(result);
            }

        }

        user = yield api.getUser();
        if (typeof data.input.created_by === 'undefined') {
            data.input.created_by = user.id;
            data.input.invited_by = user.id;
        }

        var stIntive = new StInvite;

        result = yield stIntive.createItem(data.input);

        return response.json(result);
    }

    //---------------------------------------------------------

    //---------------------------------------------------------

    //---------------------------------------------------------


    //---------------------------------------------------------


    //---------------------------------------------------------


    //---------------------------------------------------------
    //---------------------------------------------------------
} //end of class
module.exports = ApiStInviteController;
