'use strict'
const Lucid = use('Lucid');
const Database = use('Database');
const Validator = use('Validator');
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");

const Token = use("App/Model/Niddar/Token");

const table = "st_speed_tracking";
var result = {};
class StSpeedTracking extends Lucid {

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
        return this.belongsTo('App/Model/Niddar/User')
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
    static createRules() {
        return {
            validation: {
                core_user_id: 'required',
                lat: 'required',
                lng: 'required',
                speed: 'required',
                unit: 'required',
            },
            messages: {
                'core_user_id.required': Niddar.helper.validationMessages('required', 'User id'),
                'lat.required': Niddar.helper.validationMessages('required', 'Latitude'),
                'lng.required': Niddar.helper.validationMessages('required', 'Longitude'),
                'speed.required': Niddar.helper.validationMessages('required', 'Speed'),
                'unit.required': Niddar.helper.validationMessages('required', 'Speed unit'),
            },
            sanitize: {
            }
        }
    }
    //---------------------------------------------

    *createItem(input) {
        //..............validation
        const validation = yield Validator
            .validateAll(input, StSpeedTracking.createRules().validation, StSpeedTracking.createRules().messages);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }



        //..............create the record
        var item = new StSpeedTracking();
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
    *createFromToken(input)
    {
        var stSpeed = new StSpeedTracking();
        var token = new Token();
        var user = yield token.getUserFromToken(input.token);
        input.core_user_id = user.data.user_id;
        result = yield stSpeed.createItem(input);
        return result;
    }
    //---------------------------------------------
}
module.exports = StSpeedTracking
