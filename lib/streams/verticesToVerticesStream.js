module.exports = VerticesToVerticesStream;

var Transform = require('../baseTransformStream'),
    createFilter = require('../utils/filterExpression'),
    util = require('util');

util.inherits(VerticesToVerticesStream, Transform);

function VerticesToVerticesStream(graph, mode, filter) {
  if (!(this instanceof VerticesToVerticesStream)) {
    return new VerticesToVerticesStream(graph, mode, filter);
  }
  Transform.call(this);

  var customFilter;
  if (typeof filter !== 'undefined') {
    customFilter = createFilter(filter);
  } else {
    customFilter = function () { return true; }
  }

  this._graph = graph;
  if (mode === 'out') {
    this._modeFilter = function outNode(link, nodeId) {
      if (link.toId !== nodeId && customFilter(link)) {
        var node = graph.getNode(link.toId);
        if (node) {
          return node;
        }
        throw new Error("Edge link points to removed node");
      }
    };
  } else if (mode === 'in') {
    this._modeFilter = function inNode(link, nodeId) {
      if (link.fromId !== nodeId && customFilter(link)) {
        var node = graph.getNode(link.fromId);
        if (node) {
          return node;
        }
        throw new Error("Edge link starts at removed node");
      }
    };
  } else if (mode === 'both') {
    this._modeFilter = function bothNode(link, nodeId) {
      if (!customFilter(link)) {
        return;
      }
      var otherNodeId = link.fromId === nodeId ? link.toId : link.fromId;
      var node = graph.getNode(otherNodeId);
      if (node) {
        return node;
      }
      throw new Error("Edge link starts at removed node");
    };
  } else {
    throw new Error("Unsupported mode of VerticesToVerticesStream. Expected (out|in|both), got: " + mode);
  }
}

VerticesToVerticesStream.prototype._transform = function (vertex, encoding, done) {
  for (var i = 0; i < vertex.links.length; ++i) {
    var node = this._modeFilter(vertex.links[i], vertex.id);
    if (node) {
      this._trackPath(node);
      this.push(node);
    }
  }
  done();
};
