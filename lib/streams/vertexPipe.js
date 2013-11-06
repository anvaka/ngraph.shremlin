module.exports = VertexPipe;

var BasePipe = require('../basePipe'),
    util = require('util');

util.inherits(VertexPipe, BasePipe);

function VertexPipe(graph) {
  if (!(this instanceof VertexPipe)) {
    return new VertexPipe(graph);
  }

  BasePipe.call(this);
  this._graph = graph;
};

VertexPipe.prototype._moveNext = function () {
  if (this._starts.moveNext()) {
    this._current = this._starts.current();
    return true;
  }
  return false;
};
