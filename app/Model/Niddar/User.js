'use strict'
const Lucid = use('Lucid');
const Validator = use('Validator');
const Niddar = use('App/Niddar');
const Hash = use('Hash');
const table = "core_users";

var result = {};
class User extends Lucid {


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
  apiTokens () {
    return this.hasMany('App/Model/Niddar/Token', 'id', 'user_id')
  }
  //---------------------------------------------
  tokens () {
    return this.hasMany('App/Model/Niddar/Token', 'id', 'user_id')
  }
  //---------------------------------------------
  roles() {
    return this.belongsToMany('App/Model/Niddar/Role', 'core_user_role', 'core_user_id', 'core_role_id')
  }

  //---------------------------------------------
  permissions() {
    return this.hasManyThrough('App/Model/Niddar/Permission', 'App/Model/Niddar/Role')
  }
  //---------------------------------------------
  static createRules() {
    return {
      validation: {
        first_name: 'required|alpha',
        email: 'required|email|unique:' + table + ',email',
        password: 'required|min:6|max:30',
      },
      messages: {
        'first_name.required': Niddar.helper.validationMessages('required', 'Your first name'),
        'email.required': Niddar.helper.validationMessages('required', 'Your email'),
        'email.unique': Niddar.helper.validationMessages('unique', 'Email'),
        'password.required': Niddar.helper.validationMessages('required', 'Password'),
        'username.alpha_numeric': Niddar.helper.validationMessages('alpha_numeric', 'Username'),
        'username.unique': Niddar.helper.validationMessages('unique', 'Username'),
        'mobile.integer': Niddar.helper.validationMessages('integer', 'Mobile'),
        'gender.in': "Gender should be either Male, Female or Other",
      },
      sanitize: {
        email: 'normalize_email',
      }
    }
  }

  //---------------------------------------------
  static updateRules(id) {
    return {
      validation: {
        id: 'required',
        email: 'unique:' + table + ',email,id,${id}'
      },
      messages: {
        'id.required': Niddar.helper.validationMessages('required', 'id'),
      },
      sanitize: {
      }
    }
  }
  //---------------------------------------------
  *createFirstAdmin(input) {

    //..............if users already exist
    const count = yield User.query().count();
    if (count[0]['count(*)']) {
      result = {
        status: "warning",
        messages: [{message: "Users already exist, hence you can't create admin from here"}]
      };
      return result;
    }
    //..............validation
    const validation = yield Validator
      .validateAll(input, User.createRules().validation, User.createRules().messages);
    if (validation.fails()) {
      var result = {
        status: "failed",
        errors: validation.messages()
      };
      return result;
    }

    //..............sensitization
    var input = Validator.sanitize(input, User.createRules().sanitize);

    input.enable = 1;

    //..............create the record
    result = yield user.createItem(input, role.data.id);
    return result;
  }

  //---------------------------------------------
  *createItem(input, role_id)
  {
    //..............validation
    const validation = yield Validator
        .validateAll(input, User.createRules().validation, User.createRules().messages);
    if (validation.fails()) {
      var result = {
        status: "failed",
        errors: validation.messages()
      };
      return result;
    }
    //..............create the record
    try {
      var item = new User();
      input.password = yield Hash.make(input.password);
      Object.keys(input).forEach(function (key) {
        item[key] = input[key];
      });
      yield item.save();
      yield item.roles().attach([role_id]);
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
  *apiLogin(input, request)
  {
    //..............validation
    var rules = {
      validation: {
        email: 'required|email',
        password: 'required'
      },
      messages: {
        'email.required': Niddar.helper.validationMessages('required', 'Email'),
        'password.required': Niddar.helper.validationMessages('password', 'Password'),
      },
      sanitize: {
        email: 'normalize_email'
      }
    };

    const validation = yield Validator
        .validateAll(input, rules.validation, rules.message);
    if (validation.fails()) {
      var result = {
        status: "failed",
        errors: validation.messages()
      };
      return result;
    }

    input = Validator.sanitize(input, rules.sanitize);
    const authSession = request.auth.authenticator('session');
    try{
      yield authSession.attempt(input.email,input.password);
      var user = yield authSession.getUser();
      var first = yield user.tokens().first();
      result = {
        status: "success",
        data: {
          user: user,
          first: first
        }
      };
      yield authSession.logout();
      return result;
    }catch (e) {
      var errMsg;

      if(e.message == "Password does not match")
      {
        errMsg = "Invalid credentials";
      } else {
        errMsg = e.message;
      }

      result = {
        status: "failed",
        errors: [{message: errMsg}]
      };
      return result;
    }

  }
  //---------------------------------------------

  //---------------------------------------------
}
module.exports = User;
