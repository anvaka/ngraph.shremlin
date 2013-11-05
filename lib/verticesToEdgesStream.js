module.exports = VerticesToEdgesStream;

var Transform = require('./baseTransformStream'),
    createFilter = require('./filterExpression'),
    util = require('util');

util.inherits(VerticesToEdgesStream, Transform);

function VerticesToEdgesStream(graph, mode, filter) {
  if (!(this instanceof VerticesToEdgesStream)) {
    return new VerticesToEdgesStream(graph, mode, filter);
  }
  Transform.call(this);

  var customMatch = typeof filter !== 'undefined' ?
                     createFilter(filter) : function () { return true; }

  this._graph = graph;
  this._mode = mode;
  if (mode === 'out') {
    this._matchModeFilter = function (edge, vertexId) {
      return edge.fromId === vertexId && customMatch(edge);
    }
  } else if (mode === 'in') {
    this._matchModeFilter = function (edge, vertexId) {
      return edge.toId === vertexId && customMatch(edge);
    }
  } else if (mode === 'both') {
    this._matchModeFilter = function (edge, vertexId) {
      return customMatch(edge);
    }
  } else {
    throw new Error("Unsupported mode of VerticesToEdgesStream. Expected (out|in|both), got: " + mode);
  }
}

VerticesToEdgesStream.prototype._transform = function (vertex, encoding, done) {
  for (var i = 0; i < vertex.links.length; ++i) {
    var edge = vertex.links[i];
    if (this._matchModeFilter(edge, vertex.id)) {
      this._trackPath(edge);
      this.push(edge);
    }
  }
  done();
};
