'use strict'
const Lucid = use('Lucid');
const Database = use('Database');
const Validator = use('Validator');
const Niddar = use("App/Niddar");
const Setting = use("App/Model/Niddar/Setting");
const table = "st_speed_limits";
var result = {};


class StSpeedLimit extends Lucid {

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
    allocatedBy() {
        return this.belongsTo('App/Model/Niddar/User', "id", "allocated_by")
    }
    //---------------------------------------------
    static createRules() {
        return {
            validation: {
                core_user_id: "required",
                allocated_at: "required",
                speed: "required",
                unit: "required",
            },
            messages: {
                'core_user_id.required': Niddar.helper.validationMessages('required', 'User id is required for which limit needs to set'),
                'allocated_at.required': Niddar.helper.validationMessages('required', 'Date time is required in allocated_at parameter '),
                'speed.required': Niddar.helper.validationMessages('required', 'Speed is required'),
                'unit.required': Niddar.helper.validationMessages('required', 'Speed unit is required'),
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
    *createItem(input) {
        //..............validation
        const validation = yield Validator
            .validateAll(input, StSpeedLimit.createRules().validation, StSpeedLimit.createRules().messages);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }
        var stSpeedLimit = new StSpeedLimit();
        var columns = yield stSpeedLimit.getColumnList();

        //..............create the record
        var item = new StSpeedLimit();

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
    //---------------------------------------------
    //---------------------------------------------
}
module.exports = StSpeedLimit
