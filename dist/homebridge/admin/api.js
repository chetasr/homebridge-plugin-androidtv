"use strict";

require("core-js/modules/es.promise.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = api;
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/es.parse-int.js");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function api(deviceManager) {
  var api = (0, _express.default)();
  api.use(_express.default.json());
  api.get('/devices', (req, res) => {
    var devices = deviceManager.list();
    res.json(devices);
  });
  api.get('/devices/:host', (req, res) => {
    res.json(deviceManager.get(req.params.host).toJSON());
  });
  api.put('/devices/:host/pair', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (req, res) {
      yield deviceManager.pair(req.params.host);
      res.json(deviceManager.get(req.params.host).toJSON());
    });
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  api.put('/devices/:host/unpair', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (req, res) {
      yield deviceManager.unpair(req.params.host);
      res.json(deviceManager.get(req.params.host).toJSON());
    });
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  api.put('/devices/:host/secret', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (req, res) {
      var device = yield deviceManager.sendCode(req.params.host, req.body.code);
      res.json(device);
    });
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
  api.put('/devices/:host/type', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (req, res) {
      deviceManager.get(req.params.host).type = parseInt(req.body.type, 10);
      deviceManager.save();
      res.json(deviceManager.get(req.params.host));
    });
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
  api.get('/devices/:host/power', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(function* (req, res) {
      deviceManager.sendPower(req.params.host);
      res.json({});
    });
    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());
  return api;
}