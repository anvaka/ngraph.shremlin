/**
 * # Vertices to Vertices pipe
 *
 * This pipe take a `vertex` as an input, and emits adjacent `vertices` (neighbors)
 * as an output.
 */
module.exports = VerticesToVerticesPipe;

// See also: [BasePipe](../basePipe.html)
var BasePipe = require('../basePipe'),
    createFilter = require('../utils/filterExpression'),
    createEmptyIterator = require('../iterators/emptyIterator'),
    createEdgeIterator = require('../iterators/edgeIterator'),
    util = require('util');

util.inherits(VerticesToVerticesPipe, BasePipe);

/**
 * Depending on `mode` emitted vertices are:
 *
 * * `out` - emits vertices connected with outgoing edge (out adjacent)
 * * `in` - emits vertices connected with incoming edge (in adjacent)
 * * `both` - emits both `in` and `out` adjacent vertices
 *
 * See [Syntactic Sugar](../pipeSugar.html) for more examples;
 *
 * Results can be filtered based on edge attributes with `filter` attribute.
 * See [Filtering Pipes](../utils/filterExpression.html).
 */
function VerticesToVerticesPipe(graph, mode, filter) {
  if (!(this instanceof VerticesToVerticesPipe)) {
    return new VerticesToVerticesPipe(graph, mode, filter);
  }

  BasePipe.call(this);

  var customFilter;
  if (typeof filter !== 'undefined') {
    customFilter = createFilter(filter);
  } else {
    customFilter = function () { return true; }
  }

  this._currentEdgesIterator = createEmptyIterator();
  this._graph = graph;
  if (mode === 'out') {
    this._linkFilter = outNodeFilter;
    this._getNode = getOutNode;
  } else if (mode === 'in') {
    this._linkFilter = inNodeFilter;
    this._getNode = getInNode;
  } else if (mode === 'both') {
    this._linkFilter = bothNodeFilter;
    this._getNode = getOtherNode;
  } else {
    throw new Error("Unsupported mode of VerticesToVerticesPipe. Expected (out|in|both), got: " + mode);
  }

  function outNodeFilter(link, nodeId) {
    return link.toId !== nodeId && customFilter(link);
  }

  function getOutNode(link) {
    var node = graph.getNode(link.toId);
    if (node) {
      return node;
    }
    throw new Error("Edge link points to removed node");
  }

  function inNodeFilter(link, nodeId) {
    return link.fromId !== nodeId && customFilter(link);
  }

  function getInNode(link) {
    var node = graph.getNode(link.fromId);
    if (node) {
      return node;
    }
    throw new Error("Edge link starts at removed node");
  }

  function bothNodeFilter(link, nodeId) {
    return customFilter(link);
  }

  function getOtherNode(link, nodeId) {
    var otherNodeId = link.fromId === nodeId ? link.toId : link.fromId;
    var node = graph.getNode(otherNodeId);
    if (node) {
      return node;
    }
    throw new Error("Edge link starts or ends at removed node");
  }
}

VerticesToVerticesPipe.prototype._moveNext = function () {
  while (true) {
    if (this._currentEdgesIterator.moveNext()) {
      // We have neighbor node which matches search criteria. Get it:
      var edge = this._currentEdgesIterator.current();
      var currentVertex = this._sourcePipe.current();
      this._current = this._getNode(edge, currentVertex.id);
      return true;
    } else if (this._sourcePipe.moveNext()) {
      // There is no more edges for the current node. Let's move forward to next node.
      this._currentEdgesIterator = createEdgeIterator(this._sourcePipe.current(), this._linkFilter);
      // Next iteration of the outter loop will either return matching edge
      // or take next vertex or result in false response for _moveNext()
    } else {
      // There is no nodes to start from left
      return false;
    }
  }
};
