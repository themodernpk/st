'use strict'
const Lucid = use('Lucid');
const Validator = use('Validator');
const Niddar = use("App/Niddar");
const Database = use('Database');
const User = use("App/Model/SpeedoTracker/StUser");
const table = "st_user_settings";
var result = {};
class StUserSetting extends Lucid {

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
        return this.belongsTo("App/Model/SpeedoTracker/StUser")
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
    *createItem(input)  {

        //..............create the record
        var item = new StUserSetting();
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

        //..............
        var item = yield StUserSetting.find(input.id);
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
    *set(input)
    {
        var stUserSetting = new StUserSetting;
        var rules = {
            core_user_id: "required",
            key: "required",
            label: "required",
            value: "required",
        };
        const validation = yield Validator.validateAll(input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        var item = yield StUserSetting.query().where('core_user_id', input.core_user_id)
            .where('key', input.key)
            .first();

        if(item)
        {
            input.id = item.id;
            result = yield stUserSetting.updateItem(input);
        } else
        {
            result = yield stUserSetting.createItem(input);

        }
        return result;
    }

    //---------------------------------------------
    *get(input)
    {
        var rules = {
            core_user_id: "required",
            key: "required"
        };
        const validation = yield Validator.validateAll(input, rules);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }

        var item = yield StUserSetting.query().where('core_user_id', input.core_user_id)
            .where('key', input.key)
            .first();

        if(item)
        {
            result = {
                status: 'success',
                data: item
            }
        } else
        {
            result = {
                status: 'failed',
                errors: [{message: "record not found"}]
            }
        }
        return result;
    }

    //---------------------------------------------
    //---------------------------------------------
}
module.exports = StUserSetting
