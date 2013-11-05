module.exports = VertexStream;

var Readable = require('../baseReadStream'),
    VerticesToVerticesStream = require('./verticesToVerticesStream'),
    VertexIterator = require('../utils/vertexIterator'),
    util = require('util');

util.inherits(VertexStream, Readable);

function VertexStream(graph, startFrom) {
  if (!(this instanceof VertexStream)) {
    return new VertexStream(graph, startFrom);
  }
  Readable.call(this);

  this._graph = graph;
  this._vertexIterator = new VertexIterator(graph, startFrom);
  this._currentEnd = undefined;
}

VertexStream.prototype._read = function (size) {
  var iterator = this._vertexIterator,
      fetched = 0,
      needsMore = fetched < size;

  while (iterator.hasNext() && needsMore) {
    var node = iterator.next();
    ++fetched;
    this._trackPath(node);
    needsMore = this.push(node) && fetched < size;
  }

  if (!iterator.hasNext()) {
    this.push(null); // we are done here
  }
};
