'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Role = use("App/Model/Niddar/Role");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");

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
} //end of class
module.exports = ApiUserController;
