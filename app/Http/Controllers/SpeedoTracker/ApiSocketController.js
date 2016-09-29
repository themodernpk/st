'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");
const StSocket = use("App/Model/SpeedoTracker/StSocket");

var data = {};
var result = {};
var user = new User();
var token = new Token();
var socket = new StSocket();

class ApiSocketController {
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
                    socket_id: "required | socket id",
                    created_by: "optional | User id of the user who is creating the recode",
                }
            };
            return response.json(result);
        }
        user = yield api.getUser();
        if (typeof data.input.created_by === 'undefined'){

            data.input.created_by = user.id;
        }

        if (typeof data.input.user_id === 'undefined'){
            data.input.user_id = user.id;
        }

        result = yield socket.createOrUpdate(data.input);
        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiSocketController;
