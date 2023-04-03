"use strict";

require("core-js/modules/es.promise.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeviceManager = void 0;
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/web.url.to-json.js");
var _bonjour = _interopRequireDefault(require("bonjour"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _Device = require("./Device.js");
var _events = _interopRequireDefault(require("events"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
class DeviceManager extends _events.default {
  constructor(log, config, api) {
    super();
    this.log = log;
    this.config = config;
    this.api = api;
    this.devices = {};
    this.config_path = _path.default.join(api.user.storagePath(), 'androidtv-config.json');
  }
  load() {
    if (_fs.default.existsSync(this.config_path)) {
      var data = _fs.default.readFileSync(this.config_path, {
        encoding: 'utf-8'
      });
      if (data) {
        var obj = JSON.parse(data);
        if (obj.devices) {
          Object.keys(obj.devices).map((key, index) => {
            var device = obj.devices[key];
            this.devices[key] = new _Device.Device(device.host, device.port, device.name, device.cert, device.type);
            this.devices[key].paired = device.paired;
          });
        }
      }
    }
    this.log.info("Devices loaded");
  }
  save() {
    var devices = {};
    Object.keys(this.devices).map((key, index) => {
      var device = this.devices[key];
      devices[key] = {
        host: device.host,
        port: device.port,
        name: device.name,
        paired: device.paired,
        type: device.type,
        cert: device.android_remote.cert
      };
    });
    var obj = {
      devices: devices
    };
    var data = JSON.stringify(obj, null, 1);
    _fs.default.writeFileSync(this.config_path, data, {
      encoding: 'utf-8'
    });
  }
  list() {
    var devices = {};
    Object.keys(this.devices).map((key, index) => {
      var device = this.devices[key];
      devices[key] = device.toJSON();
    });
    return devices;
  }
  get(host) {
    return this.devices[host];
  }
  exist(host) {
    return !!this.get(host);
  }
  listen() {
    var _this = this;
    (0, _bonjour.default)().find({
      type: ["androidtvremote2"]
    }, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (service) {
        var name = service.name;
        var address = service.addresses[0];
        var port = service.port;
        if (address !== undefined) {
          _this.log.info('Finding online device : ', name, address, port);
          var device;
          if (_this.exist(address)) {
            device = _this.get(address);
          } else {
            device = new _Device.Device(address, port, name, null, 31);
            _this.devices[address] = device;
          }
          device.online = true;
          device.android_remote.on('secret', () => {
            console.info('Pairing', _this.devices[address].name);
            _this.devices[address].pairing = true;
          });
          device.android_remote.on('powered', powered => {
            device.powered = powered;
            _this.emit('powered', device);
          });
          device.android_remote.on('volume', volume => {
            device.volume_max = volume.maximum;
            if (device.volume_current !== volume.level) {
              device.volume_current = volume.level;
              _this.emit('volume', device);
            } else {
              device.volume_current = volume.level;
            }
            if (device.volume_muted !== volume.muted) {
              device.volume_muted = volume.muted;
              _this.emit('muted', device);
            } else {
              device.volume_muted = volume.muted;
            }
          });
          device.android_remote.on('ready', () => {
            _this.emit('discover', device);
          });
          device.android_remote.on('unpaired', () => {
            _this.unpair(device.host);
            _this.log.info("The device", device.name, "had a problem with certificates and was unpaired");
          });
          if (device.paired) {
            var result = yield device.android_remote.start();
            if (result) {
              device.started = true;
              _this.save();
            }
          }
        }
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  unpair(host) {
    var device = this.get(host);
    device.started = false;
    device.paired = false;
    device.android_remote.cert = {};
    this.save();
    return device;
  }
  pair(host) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var device = _this2.get(host);
      var result = yield device.android_remote.start();
      if (result) {
        device.started = true;
        _this2.save();
      }
      return device;
    })();
  }
  sendCode(host, code) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var device = _this3.get(host);
      var result = device.android_remote.sendCode(code);
      if (result) {
        device.pairing = false;
        device.paired = true;
        _this3.save();
      }
      return device.toJSON();
    })();
  }
  sendPower(host) {
    var device = this.get(host);
    device.android_remote.sendPower();
  }
}
exports.DeviceManager = DeviceManager;