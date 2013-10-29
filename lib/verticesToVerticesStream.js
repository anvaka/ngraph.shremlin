module.exports = VerticesToVerticesStream;

var Transform = require('stream').Transform,
    util = require('util');

util.inherits(VerticesToVerticesStream, Transform);

function VerticesToVerticesStream(graph, mode) {
  if (!(this instanceof VerticesToVerticesStream)) {
    return new VerticesToVerticesStream(graph, mode);
  }
  Transform.call(this, {objectMode: true});

  this._graph = graph;
  if (mode === 'out') {
    this._modeFilter = function outNode(link, nodeId) {
      if (link.toId !== nodeId) {
        var node = graph.getNode(link.toId);
        if (node) {
          return node;
        }
        throw new Error("Edge link points to removed node");
      }
    };
  } else if (mode === 'in') {
    this._modeFilter = function inNode(link, nodeId) {
      if (link.fromId !== nodeId) {
        var node = graph.getNode(link.fromId);
        if (node) {
          return node;
        }
        throw new Error("Edge link starts at removed node");
      }
    };
  } else if (mode === 'both') {
    this._modeFilter = function bothNode(link, nodeId) {
      var node = graph.getNode(link.fromId);
      if (node) {
        return node;
      }
      throw new Error("Edge link starts at removed node");
    };
  } else {
    throw new Error("Unsupported mode of VerticesToVerticesStream. Expected (out|in|both), got: " + mode);
  }
  this._mode = mode;
}

VerticesToVerticesStream.prototype._transform = function (vertex, encoding, done) {
  for (var i = 0; i < vertex.links.length; ++i) {
    var node = this._modeFilter(vertex.links[i], vertex.id);
    if (node) {
      this.push(node);
    }
  }
  done();
};

VerticesToVerticesStream.prototype.out = function () {
  return this.pipe(new VerticesToVerticesStream(this._graph, 'out'));
};
