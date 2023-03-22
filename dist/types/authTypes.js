"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = exports.Action = void 0;
var Action;
(function (Action) {
    Action["Manage"] = "manage";
    Action["Create"] = "create";
    Action["Read"] = "read";
    Action["ReadAll"] = "readAll";
    Action["ReadPublicOnly"] = "readPublicOnly";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
})(Action = exports.Action || (exports.Action = {}));
var Subject;
(function (Subject) {
    Subject["All"] = "all";
    Subject["User"] = "user";
    Subject["Product"] = "product";
})(Subject = exports.Subject || (exports.Subject = {}));
