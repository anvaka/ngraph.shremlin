
module.exports = EdgesToVerticesStream;

var Transform = require('stream').Transform,
    createFilter = require('./filterExpression'),
    util = require('util');

util.inherits(EdgesToVerticesStream, Transform);

function EdgesToVerticesStream(graph, mode, filter) {
  if (!(this instanceof EdgesToVerticesStream)) {
    return new EdgesToVerticesStream(graph, mode, filter);
  }
  Transform.call(this, {objectMode: true});

  this._graph = graph;
  this._mode = mode;
  if (mode === 'out') {
    this._matchModeFilter = function (edge, vertexId) {
      var fromNode = graph.getNode(edge.fromId);
      if (fromNode) {
        return [fromNode];
      }
    }
  } else if (mode === 'in') {
    this._matchModeFilter = function (edge, vertexId) {
      var toNode = graph.getNode(edge.toId);
      if (toNode) {
        return [toNode];
      }
    }
  } else if (mode === 'both') {
    this._matchModeFilter = function (edge, vertexId) {
      var fromNode = graph.getNode(edge.fromId);
      var toNode = graph.getNode(edge.toId);
      return [fromNode, toNode];
    }
  } else {
    throw new Error("Unsupported mode of EdgesToVerticesStream. Expected (out|in|both), got: " + mode);
  }
}

EdgesToVerticesStream.prototype._transform = function (edge, encoding, done) {
  var targetNode = this._matchModeFilter(edge);
  if (targetNode) {
    this.push(targetNode[0]);
    // handle case of both vertices
    if (targetNode.length === 2) {
      this.push(targetNode[1]);
    }
  }
  done();
};