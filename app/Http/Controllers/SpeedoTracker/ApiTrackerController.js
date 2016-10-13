'use strict'
const Niddar = use("App/Niddar");
const User = use("App/Model/Niddar/User");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");
const StTracker = use("App/Model/SpeedoTracker/StTracker");
const StUser = use("App/Model/SpeedoTracker/StUser");
var data = {};
var result = {};
var user = new User();
var token = new Token();
var tracker = new StTracker();
class ApiTrackerController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *request(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        if (data.input.hasOwnProperty('help')) {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    core_user_id: "required | user id ",
                    tracker_user_id: "optional | token will be used to identify the user",
                    status: "optional | default status will be pending",
                    created_by: "optional | User id of the user who is creating the recode",
                }
            };
            return response.json(result);
        }



        user = yield api.getUser();
        if (typeof data.input.created_by === 'undefined') {
            data.input.created_by = user.id;
        }
        if (typeof data.input.tracker_user_id === 'undefined') {
            data.input.tracker_user_id = user.id;
        }
        result = yield tracker.createOrUpdate(data.input);
        return response.json(result);
    }

    //---------------------------------------------------------
    *trackers(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        if (data.input.hasOwnProperty('help')) {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    token: "required | token of the user is required",
                    page: "required | page number",
                }
            };
            return response.json(result);
        }
        user = yield api.getUser();
        if (typeof data.input.page === 'undefined') {
            data.input.page = 1;
        }
        var list = yield StTracker.query().select('id', 'core_user_id', 'tracker_user_id')
            .where('core_user_id', user.id)
            .with('tracker')
            .scope('tracker', function (builder) {
                builder.select('id', 'first_name', 'last_name', 'email', 'core_country_id', 'mobile')
                    .with('token')
                    .with('socket')
            })

            .paginate(data.input.page, 1);


        return response.json(list);
    }

    //---------------------------------------------------------
    *tracking(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        if (data.input.hasOwnProperty('help')) {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    token: "required | token of the user is required",
                    page: "required | page number",
                }
            };
            return response.json(result);
        }
        user = yield api.getUser();
        if (typeof data.input.page === 'undefined') {
            data.input.page = 1;
        }
/*        var list = yield StTracker.query()
            .select('id', 'tracker_user_id', 'core_user_id')
            .where('core_user_id', user.id)
            .with('tracker')
            .scope('tracker', function (builder) {
                builder.select('id', 'first_name', 'last_name', 'email', 'core_country_id', 'mobile')
                    .with('token')
                    .with('socket')
            })
            .paginate(data.input.page, 20);*/


/*        var getUser = yield StUser
            .with('tracking.user.socket.token')
            .where('id', user.id).first();
        var list = getUser.toJSON();*/


        var list = yield StTracker.query()
            .where('tracker_user_id', user.id)
            .with('user')
            .scope('user', function (builder) {
                builder.select('id', 'first_name', 'last_name', 'email', 'core_country_id', 'mobile')
                    .with('token')
                    .with('socket')
            })

            .paginate(data.input.page, 1);


        return response.json(list);
    }

    //---------------------------------------------------------
    *allTrackersFromToken(request, response) {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        if (data.input.hasOwnProperty('help')) {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    token: "required | token of the user is required",
                }
            };
            return response.json(result);
        }
        var stTracker = new StTracker();
        result = yield stTracker.trackersFromToken(data.input.token);
        return response.json(result);
    }

    //---------------------------------------------------------
    //---------------------------------------------------------
} //end of class
module.exports = ApiTrackerController;
