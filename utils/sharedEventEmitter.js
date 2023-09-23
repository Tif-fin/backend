const EventEmitter = require("eventemitter3")
const sharedEventEmitter = new EventEmitter();
module.exports= sharedEventEmitter;