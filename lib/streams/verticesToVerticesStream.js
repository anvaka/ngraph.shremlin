module.exports = VerticesToVerticesPipe;

var BasePipe = require('../basePipe'),
    createFilter = require('../utils/filterExpression'),
    createEmptyIterator = require('../iterators/emptyIterator'),
    createEdgeIterator = require('../iterators/edgeIterator'),
    util = require('util');

util.inherits(VerticesToVerticesPipe, BasePipe);

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
      // we have neighbor node which matches search criteria. Get it:
      var edge = this._currentEdgesIterator.current();
      var currentVertex = this._starts.current();
      this._current = this._getNode(edge, currentVertex.id);
      return true;
    } else if (this._starts.moveNext()) {
      // there is no more edges for the current node. Let's move forward to next node.
      this._currentEdgesIterator = createEdgeIterator(this._starts.current(), this._linkFilter);
      // next iteration of the outter loop will either return matching edge
      // or take next vertex or result in false response for _moveNext()
    } else {
      // there is no nodes to start from left
      return false;
    }
  }
};
