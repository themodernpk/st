'use strict'

const Lucid = use('Lucid')
const Validator = use('Validator');
const User = use("App/Model/Niddar/User");

const table = "core_tokens";
var result = {};

class Token extends Lucid {


  //--------------------------------------------------
  static get table() {
    return table
  }
  //--------------------------------------------------
  user () {
    return this.belongsTo('App/Model/Niddar/User')
  }
  //--------------------------------------------------
  *generate(user, request)
  {

    var exist = yield Token.findBy('user_id', user.id);

    if(exist)
    {
      result = {
        status: "warning",
        messages: [{message:"Api token already exist"}],
        data: exist
      };
      return result;
    }

    const api = request.auth.authenticator('api');
    try{
      var token = yield api.generate(user);
      yield token.save();
      result = {
        status: "success",
        data: token
      };
    }catch (e)
    {
      result = {
        status: "failed",
        errors: [{message: e.message}]
      }
    }

    return result;
  }
  //--------------------------------------------------
  *getUserFromToken(token)
  {
    try{
      var exist = yield Token.findBy('token', token);
      result = {
        status: "success",
        data: exist
      };
      return result;
    }catch (e)
    {
      result = {
        status: "failed",
        errors: [{message: e.message}]
      };
      return result;
    }
  }
  //--------------------------------------------------

}

module.exports = Token;
