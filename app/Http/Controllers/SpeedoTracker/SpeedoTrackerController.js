'use strict'
const Niddar = use("App/Niddar");
const Token = use("App/Model/Niddar/Token");
const Setting = use("App/Model/Niddar/Setting");
const StUser = use("App/Model/SpeedoTracker/StUser");
const StSpeedTracking = use("App/Model/SpeedoTracker/StSpeedTracking");

var data = {};
var result = {};
var stUser = new StUser();
var token = new Token();
var tracking = new StSpeedTracking();

class SpeedoTrackerController {
    //---------------------------------------------------------
    //---------------------------------------------------------
    *socket(request, response) {
        data.input = request.all();
        data.params = request.params();
        data.title = Niddar.info.appName();
        data.user = yield Token.findBy("token", data.input.token);
        data.list = {};
        data.list.user = yield StUser.all();
        data.list.user = data.list.user.toJSON();

        return yield response.sendView("frontend/socket", {data});
    }
    //---------------------------------------------------------
    *test(request, response) {
        data.input = request.all();
        data.params = request.params();

        result = yield StUser.find(data.input.id);
        var trackers = yield result.trackers().fetch();


        return response.json(trackers);
    }
    //---------------------------------------------------------
    //---------------------------------------------------------
    //---------------------------------------------------------
} //end of class
module.exports = SpeedoTrackerController;
