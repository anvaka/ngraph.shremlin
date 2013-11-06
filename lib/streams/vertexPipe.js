module.exports = VertexPipe;

var BasePipe = require('../basePipe'),
    util = require('util');

util.inherits(VertexPipe, BasePipe);

function VertexPipe(graph) {
  if (!(this instanceof VertexPipe)) {
    return new VertexPipe(graph);
  }

  BasePipe.call(this);
}
