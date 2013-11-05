module.exports = PathStream;

var Transform = require('../baseTransformStream'),
    util = require('util');

util.inherits(PathStream, Transform);

function PathStream(graph) {
  if (!(this instanceof PathStream)) {
    return new PathStream(graph);
  }
  Transform.call(this);
}

PathStream.prototype._transform = function (object, encoding, done) {
  var path = this._starts.getCurrentPath();
  this.push(path);
  done();
};
