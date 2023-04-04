"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var md5_1 = __importDefault(require("md5"));
var index_1 = __importDefault(require("../index"));
var loginRouter = (0, express_1.Router)();
// POST /login-api - authenticates existing users
loginRouter.post("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedpw, username, authenticationQuery, result, userObject, properObject, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hashedpw = (0, md5_1.default)(request.body.password);
                username = request.body.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                authenticationQuery = "SELECT json_agg(a) FROM users a WHERE username = $1 AND password = $2";
                return [4 /*yield*/, index_1.default.query(authenticationQuery, [username, hashedpw])];
            case 2:
                result = _a.sent();
                // check if this user exists within the users table
                if (result.rows.length > 0 && result.rows[0].json_agg != null) {
                    userObject = result.rows[0].json_agg[0];
                    properObject = {
                        u_id: userObject["user_id"],
                        u: userObject["username"],
                        p: userObject["password"],
                        is_staff: userObject["isstaff"],
                        success: true,
                    };
                    // create a session which contains user data
                    request.session.user = properObject;
                    response.json(properObject);
                }
                else {
                    console.log("Failed to login!");
                    response.json({ success: false });
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                response.end(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = loginRouter;
