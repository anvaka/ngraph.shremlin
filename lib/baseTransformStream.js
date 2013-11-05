module.exports = BaseTransformStream;

var Transform = require('stream').Transform,
    pathTracking = require('./utils/pathTracking'),
    util = require('util');

util.inherits(BaseTransformStream, Transform);

function BaseTransformStream() {
  Transform.call(this, {objectMode: true});

  pathTracking.prepare(this);
}
