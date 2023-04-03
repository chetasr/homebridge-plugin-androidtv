"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN_NAME = exports.PLATFORM_NAME = exports.AndroidTV = void 0;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/es.promise.js");
var _index2 = require("./admin/index.js");
var _DeviceManager = require("./DeviceManager.js");
var _androidtvRemote = require("androidtv-remote");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var PLATFORM_NAME = 'HomebridgeAndroidTV';
exports.PLATFORM_NAME = PLATFORM_NAME;
var PLUGIN_NAME = 'homebridge-androidtv';
exports.PLUGIN_NAME = PLUGIN_NAME;
class AndroidTV {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.keys = {};
    this.keys[this.api.hap.Characteristic.RemoteKey.REWIND] = _androidtvRemote.RemoteKeyCode.KEYCODE_MEDIA_REWIND;
    this.keys[this.api.hap.Characteristic.RemoteKey.FAST_FORWARD] = _androidtvRemote.RemoteKeyCode.KEYCODE_MEDIA_FAST_FORWARD;
    this.keys[this.api.hap.Characteristic.RemoteKey.NEXT_TRACK] = _androidtvRemote.RemoteKeyCode.KEYCODE_MEDIA_NEXT;
    this.keys[this.api.hap.Characteristic.RemoteKey.PREVIOUS_TRACK] = _androidtvRemote.RemoteKeyCode.KEYCODE_MEDIA_PREVIOUS;
    this.keys[this.api.hap.Characteristic.RemoteKey.ARROW_UP] = _androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_UP;
    this.keys[this.api.hap.Characteristic.RemoteKey.ARROW_DOWN] = _androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_DOWN;
    this.keys[this.api.hap.Characteristic.RemoteKey.ARROW_LEFT] = _androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_LEFT;
    this.keys[this.api.hap.Characteristic.RemoteKey.ARROW_RIGHT] = _androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_RIGHT;
    this.keys[this.api.hap.Characteristic.RemoteKey.SELECT] = _androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_CENTER;
    this.keys[this.api.hap.Characteristic.RemoteKey.BACK] = _androidtvRemote.RemoteKeyCode.KEYCODE_BACK;
    this.keys[this.api.hap.Characteristic.RemoteKey.EXIT] = _androidtvRemote.RemoteKeyCode.KEYCODE_HOME;
    this.keys[this.api.hap.Characteristic.RemoteKey.PLAY_PAUSE] = _androidtvRemote.RemoteKeyCode.KEYCODE_MEDIA_PLAY_PAUSE;
    this.keys[this.api.hap.Characteristic.RemoteKey.INFORMATION] = _androidtvRemote.RemoteKeyCode.KEYCODE_INFO;
    this.channelskeys = {};
    this.channelskeys[0] = _androidtvRemote.RemoteKeyCode.KEYCODE_0;
    this.channelskeys[1] = _androidtvRemote.RemoteKeyCode.KEYCODE_1;
    this.channelskeys[2] = _androidtvRemote.RemoteKeyCode.KEYCODE_2;
    this.channelskeys[3] = _androidtvRemote.RemoteKeyCode.KEYCODE_3;
    this.channelskeys[4] = _androidtvRemote.RemoteKeyCode.KEYCODE_4;
    this.channelskeys[5] = _androidtvRemote.RemoteKeyCode.KEYCODE_5;
    this.channelskeys[6] = _androidtvRemote.RemoteKeyCode.KEYCODE_6;
    this.channelskeys[7] = _androidtvRemote.RemoteKeyCode.KEYCODE_7;
    this.channelskeys[8] = _androidtvRemote.RemoteKeyCode.KEYCODE_8;
    this.channelskeys[9] = _androidtvRemote.RemoteKeyCode.KEYCODE_9;
    this.deviceManager = new _DeviceManager.DeviceManager(log, config, api);
    this.deviceManager.load();
    this.deviceManager.on('discover', this.discover.bind(this));
    this.adminServer = new _index2.AdminServer(this.config.port ? this.config.port : 8182, this.deviceManager);
    this.adminServer.listen().then(port => {
      this.log.info("Admin server is running on port ".concat(port));
    }).catch(e => {
      this.log.error('Failed to launch the admin server:', e.message);
    });
    api.on("didFinishLaunching", () => {
      this.log.info("didFinishLaunching");
      this.deviceManager.listen();
      this.log.info("end didFinishLaunching");
    });
  }
  discover(device) {
    var _this = this;
    this.log.info("Discover : ", device.toJSON());
    var tvName = device.name;
    var uuid = this.api.hap.uuid.generate('homebridge:androidtv-' + tvName);
    this.log.info(tvName, 'Registering device', uuid);
    this.tvAccessory = new this.api.platformAccessory(thos.config.devices.find(d => d.uuid === uuid).name || tvName, uuid);
    this.tvAccessory.category = device.type;
    this.infoService = this.tvAccessory.getService(this.api.hap.Service.AccessoryInformation);
    this.infoService.setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Testing").setCharacteristic(this.api.hap.Characteristic.Model, "MODEL").setCharacteristic(this.api.hap.Characteristic.Name, tvName).setCharacteristic(this.api.hap.Characteristic.SerialNumber, uuid).setCharacteristic(this.api.hap.Characteristic.SoftwareRevision, "VERSION").setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, PLUGIN_NAME).setCharacteristic(this.api.hap.Characteristic.HardwareRevision, "PLUGIN_AUTHOR");
    var tvService = this.tvAccessory.addService(this.api.hap.Service.Television);
    tvService.setCharacteristic(this.api.hap.Characteristic.ConfiguredName, tvName);
    tvService.setCharacteristic(this.api.hap.Characteristic.SleepDiscoveryMode, this.api.hap.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
    tvService.setCharacteristic(this.api.hap.Characteristic.PowerModeSelection, this.api.hap.Characteristic.PowerModeSelection.SHOW);
    tvService.getCharacteristic(this.api.hap.Characteristic.Active).onSet((newValue, old) => {
      this.log.info(tvName, 'set Active => setNewValue: ' + newValue);
      if (device.powered !== (newValue === this.api.hap.Characteristic.Active.ACTIVE)) {
        device.android_remote.sendPower();
      }
      tvService.updateCharacteristic(this.api.hap.Characteristic.Active, newValue);
    });
    tvService.getCharacteristic(this.api.hap.Characteristic.Active).on('get', function (callback) {
      this.log.info(tvName, 'get Active', device.powered);
      callback(null, device.powered ? this.api.hap.Characteristic.Active.ACTIVE : this.api.hap.Characteristic.Active.INACTIVE); //tvService.updateCharacteristic(this.api.hap.Characteristic.Active, 1);
    }.bind(this));
    this.deviceManager.on('powered', function (device) {
      this.log.info(tvName, 'powered', device.powered);
      tvService.updateCharacteristic(this.api.hap.Characteristic.Active, device.powered ? this.api.hap.Characteristic.Active.ACTIVE : this.api.hap.Characteristic.Active.INACTIVE);
    }.bind(this));
    tvService.getCharacteristic(this.api.hap.Characteristic.RemoteKey).onSet(newValue => {
      this.log.info(tvName, 'Set RemoteKey ' + newValue);
      device.android_remote.sendKey(this.keys[newValue], _androidtvRemote.RemoteDirection.SHORT);
    });
    var speakerService = this.tvAccessory.addService(this.api.hap.Service.TelevisionSpeaker);
    speakerService.setCharacteristic(this.api.hap.Characteristic.Active, this.api.hap.Characteristic.Active.ACTIVE).setCharacteristic(this.api.hap.Characteristic.VolumeControlType, this.api.hap.Characteristic.VolumeControlType.RELATIVE_WITH_CURRENT);
    speakerService.getCharacteristic(this.api.hap.Characteristic.VolumeSelector).onSet(volumeSelector => {
      this.log.info(tvName, 'set VolumeSelector => setNewValue: ' + volumeSelector);
      if (volumeSelector === this.api.hap.Characteristic.VolumeSelector.INCREMENT) {
        device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_VOLUME_UP, _androidtvRemote.RemoteDirection.SHORT);
      } else if (volumeSelector === this.api.hap.Characteristic.VolumeSelector.DECREMENT) {
        device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_VOLUME_DOWN, _androidtvRemote.RemoteDirection.SHORT);
      }
    });
    speakerService.getCharacteristic(this.api.hap.Characteristic.Volume).on('get', function (callback) {
      var volume = 0;
      if (device.volume_max > 0) {
        volume = Math.round(device.volume_current * 100 / device.volume_max);
      }
      this.log.info(tvName, 'get VolumeSelector ' + volume);
      callback(null, volume);
    }.bind(this));
    this.deviceManager.on('volume', function (device) {
      var volume = 0;
      if (device.volume_max > 0) {
        volume = Math.round(device.volume_current * 100 / device.volume_max);
      }
      this.log.info(tvName, 'Device set Volume', volume);
      speakerService.updateCharacteristic(this.api.hap.Characteristic.Volume, volume);
    }.bind(this));
    speakerService.getCharacteristic(this.api.hap.Characteristic.Mute).onSet(function (muted) {
      this.log.info(tvName, 'set Mute => muted: ' + muted);
      device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_VOLUME_MUTE, _androidtvRemote.RemoteDirection.SHORT);
      speakerService.updateCharacteristic(this.api.hap.Characteristic.Mute, muted);
    });
    this.deviceManager.on('muted', function (device) {
      this.log.info(tvName, 'Device set mute', device.volume_muted);
      speakerService.updateCharacteristic(this.api.hap.Characteristic.Mute, device.volume_muted);
    }.bind(this));
    speakerService.getCharacteristic(this.api.hap.Characteristic.Mute).on("get", function (callback) {
      var muted = device.volume_muted;
      this.log.info(tvName, 'get VolumeMutedSelector');
      callback(null, muted);
    }.bind(this));
    var identifier = 0;
    if (this.config.channels) {
      for (var channel of this.config.channels) {
        var _uuid = this.api.hap.uuid.generate('homebridge:androidtv-' + tvName + '-channel-' + channel.name);
        var service = this.tvAccessory.addService(this.api.hap.Service.InputSource, _uuid, channel.name);
        this.log.info(tvName, 'Adding channel', channel.name, _uuid);
        service.setCharacteristic(this.api.hap.Characteristic.Identifier, identifier);
        service.setCharacteristic(this.api.hap.Characteristic.ConfiguredName, channel.name);
        service.setCharacteristic(this.api.hap.Characteristic.IsConfigured, this.api.hap.Characteristic.IsConfigured.CONFIGURED);
        service.setCharacteristic(this.api.hap.Characteristic.InputSourceType, this.api.hap.Characteristic.InputSourceType.TUNER);
        tvService.addLinkedService(service);
        identifier++;
      }
    }
    if (this.config.keys) {
      for (var key of this.config.keys) {
        var _uuid2 = this.api.hap.uuid.generate('homebridge:androidtv-' + tvName + '-key-' + key.name);
        var _service = this.tvAccessory.addService(this.api.hap.Service.InputSource, _uuid2, key.name);
        this.log.info(tvName, 'Adding key', key.name, _uuid2);
        _service.setCharacteristic(this.api.hap.Characteristic.Identifier, identifier);
        _service.setCharacteristic(this.api.hap.Characteristic.ConfiguredName, key.name);
        _service.setCharacteristic(this.api.hap.Characteristic.IsConfigured, this.api.hap.Characteristic.IsConfigured.CONFIGURED);
        _service.setCharacteristic(this.api.hap.Characteristic.InputSourceType, this.api.hap.Characteristic.InputSourceType.TUNER);
        tvService.addLinkedService(_service);
        identifier++;
      }
    }
    if (this.config.applications) {
      for (var application of this.config.applications) {
        var _uuid3 = this.api.hap.uuid.generate('homebridge:androidtv-' + tvName + '-application-' + application.name);
        var _service2 = this.tvAccessory.addService(this.api.hap.Service.InputSource, _uuid3, application.name);
        this.log.info(tvName, 'Adding application', application.name, _uuid3);
        _service2.setCharacteristic(this.api.hap.Characteristic.Identifier, identifier);
        _service2.setCharacteristic(this.api.hap.Characteristic.ConfiguredName, application.name);
        _service2.setCharacteristic(this.api.hap.Characteristic.IsConfigured, this.api.hap.Characteristic.IsConfigured.CONFIGURED);
        _service2.setCharacteristic(this.api.hap.Characteristic.InputSourceType, this.api.hap.Characteristic.InputSourceType.APPLICATION);
        tvService.addLinkedService(_service2);
        identifier++;
      }
    }
    tvService.setCharacteristic(this.api.hap.Characteristic.ActiveIdentifier, 0);
    tvService.getCharacteristic(this.api.hap.Characteristic.ActiveIdentifier).onSet( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (newValue) {
        var channel_length = 0;
        var key_length = 0;
        if (_this.config.channels) {
          channel_length = _this.config.channels.length;
        }
        if (_this.config.keys) {
          key_length = _this.config.keys.length;
        }
        if (newValue < channel_length) {
          if (_this.config.channels) {
            var _channel = _this.config.channels[newValue];
            var array = _this.splitChannelNumber(_channel.number);
            device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_HOME, _androidtvRemote.RemoteDirection.SHORT);
            yield new Promise(resolve => setTimeout(resolve, 500));
            device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_HOME, _androidtvRemote.RemoteDirection.SHORT);
            yield new Promise(resolve => setTimeout(resolve, 500));
            device.android_remote.sendKey(_androidtvRemote.RemoteKeyCode.KEYCODE_DPAD_CENTER, _androidtvRemote.RemoteDirection.SHORT);
            yield new Promise(resolve => setTimeout(resolve, 500));
            for (var button of array) {
              _this.log.info(tvName, 'Tap on ' + button + ' ' + _this.channelskeys[button]);
              device.android_remote.sendKey(_this.channelskeys[button], _androidtvRemote.RemoteDirection.SHORT);
            }
          }
        } else if (newValue < channel_length + key_length) {
          if (_this.config.keys) {
            var index = newValue - channel_length;
            var _key = _this.config.keys[index];
            var value = _androidtvRemote.RemoteKeyCode[_key.key];
            device.android_remote.sendKey(value, _androidtvRemote.RemoteDirection.SHORT);
            _this.log.info(tvName, 'Tap on ' + _key.key + ' ' + _androidtvRemote.RemoteKeyCode[_key.key]);
          }
        } else {
          if (_this.config.applications) {
            var _index = newValue - channel_length - key_length;
            var _application = _this.config.applications[_index];
            _this.log.info(tvName, "Sending link " + _application.link);
            device.android_remote.sendAppLink(_application.link);
          }
        }
        _this.log.info(tvName, 'set Active Identifier => setNewValue: ' + newValue);
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    this.api.publishExternalAccessories(PLUGIN_NAME, [this.tvAccessory]);
  }
  splitChannelNumber(number) {
    var string_number = String(number);
    var array = string_number.split('');
    return array;
  }
}
exports.AndroidTV = AndroidTV;