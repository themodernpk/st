'use strict'
const Lucid = use('Lucid');
const Database = use('Database');
const Validator = use('Validator');
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");
const StUser = use("App/Model/SpeedoTracker/StUser");

const Token = use("App/Model/Niddar/Token");

const table = "st_sockets";
var result = {};

class StSocket extends Lucid {

    //---------------------------------------------
    static get table() {
        return table;
    }

    //---------------------------------------------
    static get deleteTimestamp() {
        return null
    }

    //---------------------------------------------
    static get dateFormat() {
        return 'YYYY-MM-DD HH:mm:ss'
    }
    //---------------------------------------------
    user() {
        return this.belongsTo('App/Model/SpeedoTracker/StUser', 'id', 'core_user_id')
    }
    //---------------------------------------------
    token() {
        return this.hasOne('App/Model/Niddar/Token', 'core_user_id', 'user_id')
    }
    //---------------------------------------------
    static createRules() {
        return {
            validation: {
                core_user_id: 'required',
                socket_id: 'required',
            },
            messages: {
                'core_user_id.required': Niddar.helper.validationMessages('required', 'User id'),
                'socket_id.required': Niddar.helper.validationMessages('required', 'Socket'),
            },
            sanitize: {
            }
        }
    }
    //---------------------------------------------
    static updateRules() {
        return {
            validation: {
                id: 'required',
            },
            messages: {
                'id.required': Niddar.helper.validationMessages('required', 'ID'),
            },
            sanitize: {
            }
        }
    }
    //---------------------------------------------
    *getColumnList()
    {
        var list =yield Database.table(table).columnInfo();
        var result = {};
        var i = 0;
        Object.keys(list).forEach(function(key) {
            result[i] = key;
            i++;
        });
        return result;
    }
    //---------------------------------------------
    *createOrUpdateFromToken(input)
    {
        var rules = {
            token: "required"
        };

        const validation = yield Validator.validateAll(input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        var stSocket = new StSocket();
        var token = new Token();
        var user = yield token.getUserFromToken(input.token);
        input.core_user_id = user.data.user_id;
        result = yield stSocket.createOrUpdate(input);
        return result;
    }
    //---------------------------------------------
    *createOrUpdate(input)
    {
        var stSocket = new StSocket();
        if (typeof input.core_user_id !== 'undefined'){
            var item = yield StSocket.findBy('core_user_id', input.core_user_id);
            if(item)
            {
                input.id = item.id;
                result = yield stSocket.updateItem(input);
            } else
            {
                result = yield stSocket.createItem(input);
            }
        } else
        {
            result = yield stSocket.createItem(input);
        }

        return result;
    }
    //---------------------------------------------
    *createItem(input)  {

        //..............validation
        const validation = yield Validator
            .validateAll(input, StSocket.createRules().validation, StSocket.createRules().messages);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        //..............if exist record exist then return value with warning
        if (input.hasOwnProperty('core_user_id')) {
            var item = yield StSocket.query().where('core_user_id', input.core_user_id).first();
            if (item) {
                result = {
                    status: "warning",
                    data: item,
                    messages: [
                        {
                            type: "error",
                            message: "Record already exist"
                        }
                    ]
                };
                return result;
            }
        }

        //..............create the record
        var item = new StSocket();
        var columns = yield item.getColumnList();

        try {
            for(var key in columns) {
                var column_name = columns[key];
                if (input.hasOwnProperty(column_name)) {
                    item[column_name] = input[column_name];
                }
            }
            yield item.save();
            result = {
                status: "success",
                data: item,
                messages: [
                    {
                        type: "success",
                        message: "Record created"
                    }
                ]
            };
        } catch (e) {
            result = {
                status: "failed",
                errors: [{message: e.message}]
            };
        }
        return result;
    }
    //---------------------------------------------
    *updateItem(input) {
        //..............validation
        const validation = yield Validator
            .validateAll(input, StSocket.updateRules().validation, StSocket.updateRules().messages);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        //..............
        var item = yield StSocket.find(input.id);
        var columns = yield item.getColumnList();

        try {
            for(var key in columns) {
                var column_name = columns[key];
                if (input.hasOwnProperty(column_name)) {
                    item[column_name] = input[column_name];
                }
            }
            yield item.save();
            result = {
                status: "success",
                data: item,
                messages: [
                    {
                        type: "success",
                        message: "Record updated"
                    }
                ]
            };
        } catch (e) {
            result = {
                status: "failed",
                errors: [{message: e.message}]
            };
        }
        return result;
    }
    //---------------------------------------------



    //---------------------------------------------
}
module.exports = StSocket
