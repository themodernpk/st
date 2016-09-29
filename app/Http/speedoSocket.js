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
module.exports = function (server) {

    const io = use('socket.io')(server);
    var connections = [];
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
            //console.log("token", token);
            //console.log("socket", socket_id);
            connections[token] = socket_id;
            //console.log("connections", connections);
            io.to(socket_id).emit('socket_specific', 'for your eyes only');
        }
        next();
    });

    //---------------------------------------------------------------
    io.on('connection', function (socket) {
        console.log('Socket connected - %s socket are active', connections.length);

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
            //console.log(data);
        }, function (err) {
            console.error(err.stack);
        });

        //-------------------------------------
        //receive tracking requests
        socket.on("raise_tracking_request", function (data) {
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
            //store the data to database
            co(function* () {
                var trackers = yield stTracker.trackersFromToken(data.token);
                return trackers;
            }).then(function (trackersData) {
                for (var item in trackersData) {
                    console.log("response", trackersData[item]);
                    io.to(trackersData[item]).emit('emit_tracked_speed', data);
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