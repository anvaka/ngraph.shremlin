module.exports = PathStream;

var Transform = require('stream').Transform,
    createFilter = require('./filterExpression'),
    util = require('util');

util.inherits(PathStream, Transform);

function PathStream(graph) {
  if (!(this instanceof PathStream)) {
    return new PathStream(graph);
  }
  Transform.call(this, {objectMode: true});
  var dst = this;
  this.on('pipe', function(src) {
    if (dst._starts) {
      throw new Error("Graph streams allows only one source");
    }
    dst._starts = src;
  });
}

PathStream.prototype._transform = function (object, encoding, done) {
  var path = this._starts.getCurrentPath();
  this.push(path);
  done();
};
