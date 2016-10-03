'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Setting = use("App/Model/Niddar/Setting");
const Permission = use("App/Model/Niddar/Permission");
const Validator = use('Validator');
const Route = use('Route');
const Token = use("App/Model/Niddar/Token");


var data = {};
var result = {};
var token = new Token();

class ApiTokenController{
//---------------------------------------------------------
//---------------------------------------------------------
    //---------------------------------------------------------
    *generate(request, response)
    {
        data.input = request.all();
        data.params = request.params();

        //..............validation
        var rules = {
            email: 'required|email',
            password: 'required|min:6|max:30',
        };
        const validation = yield Validator.validateAll(data.input, rules);

        if (validation.fails()) {
            result = {
                status: "failed",
                errors: validation.messages()
            };
            return response.json(result);
        }

        const authSession = request.auth.authenticator('session');
        const login = yield authSession.attempt(data.input.email,data.input.password);
        if (!login) {
            result = {
                status: "failed",
                errors: [{message: "Invalid credentials"}]
            };
            return response.json(result);
        }
        const user = yield authSession.getUser();



        result = yield token.generate(user, request);

        yield authSession.logout();
        return response.json(result);
    }
    //---------------------------------------------------------
} //end of class
module.exports = ApiTokenController;
