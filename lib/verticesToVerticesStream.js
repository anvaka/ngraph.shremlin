module.exports = VerticesToVerticesStream;

var Transform = require('stream').Transform,
    extendStream = require('./streamExtensions'),
    createFilter = require('./filterExpression'),
    util = require('util');

util.inherits(VerticesToVerticesStream, Transform);

function VerticesToVerticesStream(graph, mode, filter) {
  if (!(this instanceof VerticesToVerticesStream)) {
    return new VerticesToVerticesStream(graph, mode, filter);
  }
  Transform.call(this, {objectMode: true});

  var customFilter;
  if (typeof filter !== 'undefined') {
    customFilter = createFilter(filter);
  } else {
    customFilter = function () { return true; }
  }

  this._graph = graph;
  if (mode === 'out') {
    this._modeFilter = function outNode(link, nodeId) {
      if (link.toId !== nodeId) {
        var node = graph.getNode(link.toId);
        if (node) {
          if (customFilter(node)) {
            return node;
          } else {
            // not is present, all is good, but it doesn't match client's filter
            return;
          }
        }
        throw new Error("Edge link points to removed node");
      }
    };
  } else if (mode === 'in') {
    this._modeFilter = function inNode(link, nodeId) {
      if (link.fromId !== nodeId) {
        var node = graph.getNode(link.fromId);
        if (node) {
          if (customFilter(node)) {
            return node;
          } else {
            // not is present, all is good, but it doesn't match client's filter
            return;
          }
        }
        throw new Error("Edge link starts at removed node");
      }
    };
  } else if (mode === 'both') {
    this._modeFilter = function bothNode(link, nodeId) {
      var otherNodeId = link.fromId === nodeId ? link.toId : link.fromId;
      var node = graph.getNode(otherNodeId);
      if (node) {
        if (customFilter(node)) {
          return node;
        } else {
          // not is present, all is good, but it doesn't match client's filter
          return;
        }
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
      this.push(node);
    }
  }
  done();
};

extendStream(VerticesToVerticesStream.prototype);
