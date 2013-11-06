module.exports = PathPipe;

var BasePipe = require('../basePipe'),
    util = require('util');

util.inherits(PathPipe, BasePipe);

function PathPipe(graph) {
  if (!(this instanceof PathPipe)) {
    return new PathPipe(graph);
  }
  this._graph = graph;
  BasePipe.call(this);
}

PathPipe.prototype._moveNext = function () {
  if (this._starts.moveNext()) {
    this._current = this._starts.getCurrentPath();
    return true;
  }
  return false;
};
