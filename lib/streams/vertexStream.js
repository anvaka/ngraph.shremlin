module.exports = VertexStream;

var BasePipe = require('../basePipe'),
    VertexIterator = require('../utils/vertexIterator'),
    util = require('util');

util.inherits(VertexStream, BasePipe);

function VertexStream(graph, startFrom) {
  if (!(this instanceof VertexStream)) {
    return new VertexStream(graph, startFrom);
  }

  BasePipe.call(this);

  this.setStarts(new VertexIterator(graph, startFrom));
}
