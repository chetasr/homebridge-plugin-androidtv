"use strict";

require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminServer = void 0;
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.promise.js");
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireWildcard(require("path"));
var _api = require("./api.js");
var _url = require("url");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var directory = (0, _path.dirname)((0, _url.fileURLToPath)(require('url').pathToFileURL(__filename).toString()));
class AdminServer {
  constructor(port, deviceManager) {
    this.port = port;
    this.deviceManager = deviceManager;
    this.app = (0, _express.default)();
    this.app.use('/api', (0, _api.api)(this.deviceManager));
    this.app.use('/', _express.default.static(_path.default.join(directory, 'static')));
  }
  listen() {
    return new Promise((resolve, reject) => {
      var server = this.app.listen(this.port, () => {
        resolve(server.address().port);
      }).on('error', e => {
        console.error(e);
        reject(e);
      });
    });
  }
}
exports.AdminServer = AdminServer;