'use strict'
const Lucid = use('Lucid');
const Niddar = use("App/Niddar");
const Database = use('Database');
const Validator = use('Validator');
const table = "st_invites";
var result = {};


class StInvite extends Lucid {

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
    invitedBy() {
        return this.belongsTo('App/Model/SpeedoTracker/StUser')
    }
    //---------------------------------------------
    static createRules() {
        return {
            validation: {
                invited_by: "required",
                name: "required",
                message: "required",
            },
            messages: {
                'invited_by.required': Niddar.helper.validationMessages('required', 'User id is required'),
                'name.required': Niddar.helper.validationMessages('required', 'Name is required'),
                'message.required': Niddar.helper.validationMessages('required', 'Messaged'),
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
            .validateAll(input, StInvite.createRules().validation, StInvite.createRules().messages);
        if (validation.fails()) {
            var result = {
                status: "failed",
                errors: validation.messages()
            };
            return result;
        }
        var stInvite = new StInvite();
        var columns = yield stInvite.getColumnList();


        //..............create the record
        var item = new StInvite();

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
module.exports = StInvite
