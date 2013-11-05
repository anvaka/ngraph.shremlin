module.exports = BaseReadStream;

var Readable = require('stream').Readable,
    pathTracking = require('./utils/pathTracking'),
    util = require('util');

util.inherits(BaseReadStream, Readable);

function BaseReadStream() {
  Readable.call(this, {objectMode: true});

  pathTracking.prepare(this);
}
