'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Role = use("App/Model/Niddar/Role");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");

const StUser = use("App/Model/SpeedoTracker/StUser");

var data = {};
var result = {};
var user = new User();
var role = new Role();
var token = new Token();

class ApiUserController {
//---------------------------------------------------------
//---------------------------------------------------------
    *register(request, response) {
        data.input = request.all();
        data.params = request.params();

        var roleResult = yield role.firstOrCreate({name: "Registered"});
        if(roleResult.status == "failed")
        {
            return response.json(roleResult);
        }
        result = yield user.createItem(data.input, roleResult.data.id);
        return response.json(result);
    }

    //---------------------------------------------------------
    *login(request, response) {
        data.input = request.all();
        data.params = request.params();
        result = yield user.apiLogin(data.input, request);
        return response.json(result);
    }
    //---------------------------------------------------------
    *details(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        try {
            user = yield api.getUser();
            result = {
                status: "success",
                data: user
            };
        } catch (e) {
            result = {
                status: "failed",
                errors: [{message: e.message}]
            };
        }
        return response.json(result);
    }
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
                    token: "required | current user token ",
                }
            };
            return response.json(result);
        }
        user = yield api.getUser();
        var stUser = yield StUser.query().select('id', 'first_name').where("id",user.id).first();
        var token = yield stUser.token().first();
        var trackers = yield stUser.trackers().with('user.token', 'socket').fetch();

        if(trackers)
        {

            for(var item in trackers)
            {

            }
        }
        var tracking = yield stUser.tracking().with('user.token', 'socket').fetch();
        result = {
            user: stUser,
            token: token,
            trackers: trackers,
            tracking: tracking,
        };
        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiUserController;
