"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _platform = require("./homebridge/platform.js");
var _default = api => {
  api.registerPlatform(_platform.PLATFORM_NAME, _platform.AndroidTV);
};
exports.default = _default;