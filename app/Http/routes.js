'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('frontend/index')




/*
 |--------------------------------------------------------------------------
 | Backend - Setup
 |--------------------------------------------------------------------------
 */
Route.group('backend', function () {

    //application setup

    Route.any("/database/save", 'Niddar/SetupController.dbSave')
        .as("setupDbSave");

    Route.any("/database/connect", 'Niddar/SetupController.dbConnect')
        .as("setupDbConnect");


    Route.get("/migration/run", 'Niddar/SetupController.migrationRun')
        .as("setupMigrationRun").formats(['json']);

    Route.get("/migration/reset", 'Niddar/SetupController.migrationReset')
        .formats(['json']);

    Route.get("/migration/refresh", 'Niddar/SetupController.migrationRefresh')
        .formats(['json']);


    Route.any("/create/first/admin", 'Niddar/SetupController.createFirstAdmin')
        .as("setupCreateFirstAdmin");



}).prefix('/backend/setup');


/*
 |--------------------------------------------------------------------------
 | Backend - Public
 |--------------------------------------------------------------------------
 */
Route.group('bPublic', function () {

    Route.get("/", 'Niddar/BackendController.redirectToLogin')
        .as("bIndex");

    Route.get("/login", 'Niddar/BackendController.login')
        .as("bLogin");

    Route.get("/create/admin", 'Niddar/BackendController.createAdmin')
        .as("bCreateAdmin");

    Route.post("/create/admin", 'Niddar/BackendController.createAdminPost')
        .as("bCreateAdminPost");

    Route.any("/authenticate", 'Niddar/BackendAuthController.authenticate')
        .as("bAuthenticate");

}).prefix('/backend');

/*
 |--------------------------------------------------------------------------
 | Backend - Protected
 |--------------------------------------------------------------------------
 */
Route.group('bProtected', function () {

    Route.get("/dashboard", 'Niddar/BackendController.dashboard')
        .as("bDashboard");

    Route.get("/logout", 'Niddar/BackendAuthController.logout')
        .as("bLogout");

    //---------------------Permissions

    Route.get("/admin/permission", 'Niddar/PermissionController.index')
        .as("bPindex");

    Route.any("/admin/permission/create", 'Niddar/PermissionController.create')
        .as("bPcreate");


    Route.any("/admin/permission/list", 'Niddar/PermissionController.list')
        .as("bPlist");

    Route.any("/admin/permission/read/:id", 'Niddar/PermissionController.read')
        .as("bPread");

    Route.any("/admin/permission/update", 'Niddar/PermissionController.update')
        .as("bPupdate");

    Route.any("/admin/permission/toggle/status", 'Niddar/PermissionController.toggleStatus')
        .as("bPtoggleStatus");

    Route.any("/admin/permission/delete", 'Niddar/PermissionController.delete')
        .as("bPdelete");


}).prefix('/backend').middleware('authBackend');


/*
 |--------------------------------------------------------------------------
 | Backend - API - Public
 |--------------------------------------------------------------------------
 */
const api_version = "/v1";
Route.group('bApiPublic', function () {

    Route.any("/token/generate", 'Niddar/ApiTokenController.generate')
        .as("apiTokenGenerate");
    Route.any("/user/register", 'Niddar/ApiUserController.register')
        .as("apiUserRegister");
    Route.any("/user/login", 'Niddar/ApiUserController.login')
        .as("apiUserLogin");

}).prefix('/api'+api_version);
/*
 |--------------------------------------------------------------------------
 | Backend - API
 |--------------------------------------------------------------------------
 */
Route.group('bApi', function () {
    Route.any("/user/details", 'Niddar/ApiUserController.details');



}).prefix('/api'+api_version).middleware('authApi');


/*
 |--------------------------------------------------------------------------
 | SpeedoTracker
 |--------------------------------------------------------------------------
 */
Route.group('speedoTrackerPublic', function () {
    Route.any("/socket", 'SpeedoTracker/SpeedoTrackerController.socket');
    Route.any("/test", 'SpeedoTracker/SpeedoTrackerController.test');
}).prefix("/speedotracker");


/*
 |--------------------------------------------------------------------------
 | API - SpeedoTracker
 |--------------------------------------------------------------------------
 */
Route.group('apiSt', function () {
    Route.any("/speed/sync", 'SpeedoTracker/ApiSpeedTrackerController.sync');
    Route.any("/socket/sync", 'SpeedoTracker/ApiSocketController.sync')
        .as("apiSocketSync");

    Route.any("/tracker/request", 'SpeedoTracker/ApiTrackerController.request')
        .as("apiTrackerRequest");

    Route.any("/get/users", 'SpeedoTracker/ApiStUserController.users')
        .as("apiStUsers");

    Route.any("/speed/history", 'SpeedoTracker/ApiSpeedTrackerController.history')
        .as("apiSpeedHistory");

    Route.any("/user/sync", 'Niddar/ApiUserController.sync');


}).prefix('/api'+api_version+"/st").middleware('authApi');