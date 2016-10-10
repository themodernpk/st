'use strict';
class AuthApi {
  * handle(request, response, next) {
    var result = {};
    const api = request.auth.authenticator('api');


    const user = yield api.getUser();
    if(!user) {
      result = {
        status: "failed",
        errors: [{message: "Login failed"}]
      };
      response.unauthorized(result);
    }

/*    if(user.enable == 0)
    {
      result = {
        status: "failed",
        errors: [{message: "Account is disabled"}]

      };
      response.unauthorized(result);
    }
 */

    yield next;
  }
}
module.exports = AuthApi;
