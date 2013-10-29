module.exports = VertexStream;

var Readable = require('stream').Readable,
    VerticesToVerticesStream = require('./verticesToVerticesStream'),
    util = require('util');

util.inherits(VertexStream, Readable);

function VertexStream(graph, startFrom) {
  if (!(this instanceof VertexStream)) {
    return new VertexStream(graph);
  }
  Readable.call(this, {objectMode: true});

  var VertexIterator = require('./vertexIterator');
  this._graph = graph;
  this._vertexIterator = new VertexIterator(graph, startFrom);
}

VertexStream.prototype._read = function (size) {
  var iterator = this._vertexIterator,
      fetched = 0,
      needsMore = fetched < size;

  while (iterator.hasNext() && needsMore) {
    var node = iterator.next();
    ++fetched;
    needsMore = this.push(node) && fetched < size;
  }

  if (!iterator.hasNext()) {
    this.push(null); // we are done here
  }
};

VertexStream.prototype.out = function () {
  return this.pipe(new VerticesToVerticesStream(this._graph, 'out'));
};
