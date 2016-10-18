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

        if (data.input.hasOwnProperty('help'))
        {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    email: "email or mobile must be set ",
                    mobile: "email or mobile must be set",
                    tracker_user_id: "optional | token will be used to identify the user",
                    status: "optional | default status will be pending",
                    created_by: "optional | User id of the user who is creating the recode",
                }
            };
            return response.json(result);
        }

        data.input.user = yield api.getUser();

        var stTracker = new StTracker;

        result = yield stTracker.trackerRequest(data.input);

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
        data.input.user = yield api.getUser();
        data.input.status = 'approved';

        var stTracker = new StTracker;
        result = yield stTracker.trackersList(data.input);

        return response.json(result);
    }

    //---------------------------------------------------------
    *trackersPendingRequests(request, response)
    {
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
        data.input.user = yield api.getUser();
        data.input.status = 'pending';

        var stTracker = new StTracker;
        result = yield stTracker.trackersList(data.input);

        return response.json(result);

    }
    //---------------------------------------------------------
    *trackerChangeStatus(request, response)
    {
        data.input = request.all();
        data.params = request.params();
        const api = request.auth.authenticator('api');
        if (data.input.hasOwnProperty('help')) {
            result = {
                status: "help",
                title: "This method accept following parameters",
                parameters: {
                    token: "required | token of the user is required",
                    tracker_user_id: "required | user id",
                    status: "required | approved or disapproved ",
                }
            };
            return response.json(result);
        }

        data.input.user = yield api.getUser();

        var stTracker = new StTracker;
        result = yield stTracker.changeStatus(data.input);

        return response.json(result);

    }
    //---------------------------------------------------------


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

        var list = yield StTracker.query()
            .where('tracker_user_id', user.id)
            .where("status", 'approved')
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
