'use strict';
const httpRequest = require("request");
const Route = use('Route');
const Config = use('Config');
const Env = use('Env');
var co = require('co');
var clc = require('cli-color');
const StUser = use("App/Model/SpeedoTracker/StUser");
const StSocket = use("App/Model/SpeedoTracker/StSocket");
const StTracker = use("App/Model/SpeedoTracker/StTracker");
const StSpeedTracking = use("App/Model/SpeedoTracker/StSpeedTracking");

var stUser = new StUser();
var stSocket = new StSocket();
var stTracker = new StTracker();
var stSpeedTracking = new StSpeedTracking();

var red = clc.red;
var yellow = clc.yellow;
var blue = clc.blue;
var green = clc.green;

module.exports = function (server) {

    const io = use('socket.io')(server);
    var connections = [];
    var count = [];
    var currentSocket;
    var currentToken;
    //----------------------------------------------------------------
    io.use(function(socket, next) {
        var handshakeData = socket.request;
        var input = handshakeData._query;
        if (typeof input.token !== 'undefined'){
            var token = input.token;
            var socket_id = socket.id;
            currentSocket = socket_id;
            currentToken = token;
            //console.log("before connection", token);
            //console.log("socket", socket_id);
            connections[token] = socket_id;
            //console.log("connections", connections);
        }
        next();
    });

    //---------------------------------------------------------------
    io.on('connection', function (socket) {
        count.push(socket);
        console.log('Socket connected - %s socket are active', count.length);
        //console.log('Socket connected - %s socket are active', connections.length);
        //console.log("connection", connections);

        if(!currentToken)
        {
            console.log(red("token not received, this may generator errors"));
        } else
        {
            console.log(green("token received, token="+currentToken));
        }


        //-------------------------------------
        //update the socket and user id in the database
        co(function* () {
            var input = {
                socket_id: currentSocket,
                    token: currentToken
            };
            var result = yield stSocket.createOrUpdateFromToken(input);
            return result;
        }).then(function (responseData) {

            if(responseData.status == "failed")
            {
                console.log(responseData);
            }

        }, function (err) {
            console.error(err.stack);
        });

        //-------------------------------------
        //receive tracking requests
        socket.on("raise_tracking_request", function (data) {
            /* Parameters to pass
             * token: token of the current user
             * core_user_id: user id which current user want to track
             */
            //store the request to database
            co(function* () {
                var result = yield stTracker.createFromToken(data);
                return result;
            }).then(function (responseData) {
                console.log(responseData);
                io.to(currentSocket).emit('raise_tracking_request_response', responseData);
            }, function (err) {
                console.error(err.stack);
            });
        });

        //-------------------------------------
        //receive tracked speed
        socket.on("receive_tracked_speed", function (data) {
            /* Parameters to pass
             * speed: speed in default unit
             * lat: latitude
             * lng: longitude
             * unit: default speed unit
             * token: current user token
             */
            console.log(green("data - received"), data);
            var receivedData = data;
            //store the data to database
            co(function* () {
                var trackers = yield stTracker.trackersFromToken(data.token);
                return trackers;
            }).then(function (trackersData) {
                console.log(red("data - sent"), receivedData);
                //console.log("response", trackersData);
                if(trackersData.status == "success")
                {

                    console.log(red("start----------------------------------------------"));
                    var i =1;
                    var trackersList = trackersData.data;
                    for (var item in trackersList)
                    {
                        io.to(trackersList[item].socket).emit('emit_tracked_speed', receivedData);
                        var con_text = i+" - Event triggered: emit_tracked_speed | Socket ID ="+trackersList[item].socket;
                        console.log(yellow(con_text));
                        con_text = " Email = "+trackersList[item].email;
                        con_text += " | user_id = "+trackersList[item].user_id;
                        console.log(green(con_text));
                        console.log(red("data emitted="), receivedData);
                        i++;
                    }
                    console.log(red("end----------------------------------------------"));

                } else
                {
                    console.log(red("error"), trackersData);
                }


            }, function (err) {
                console.error(err.stack);
            });
        });
        //-------------------------------------
        //update  the socket id in database
        io.to(currentSocket).emit('socket_specific', currentSocket);
        //-------------------------------------
        //-------------------------------------
        //-------------------------------------
        //-------------------------------------
        //-------------------------------------
    });
    //---------------------------------------------------------------


}; //end