'use strict';
// simple wrapper over ngraph.forEachNode
// to perform lazy iteration
// Todo: this facility should probably be provided by ngraph.graph itself

module.exports = VertexIterator;

function VertexIterator(graph, startFrom) {
  this._graph = graph;
  this._startFrom = startFrom;
  this._currentIndex = 0;
  this._allNodes = [];
  this._initialized = false;

  if (typeof startFrom !== 'undefined') {
    var node = graph.getNode(startFrom);
    if (node) {
      this._allNodes.push(node);
    }
    this._hasNext = !!node;
    this._initialized = true;
  } else {
    this._hasNext = graph.getNodesCount() > 0;
  }
}

VertexIterator.prototype.hasNext = function () {
  return this._hasNext;
};

VertexIterator.prototype.next = function () {
  if (!this._initialized) {
    // TODO: that's why this should be done within ngraph.graph:
    var iterator = this;
    this._allNodes = [];
    this._graph.forEachNode(function (node) {
      iterator._allNodes.push(node);
    });
    this._initialized = true;
  }

  if (this._hasNext) {
    this._hasNext = this._currentIndex + 1 < this._allNodes.length;
    return this._allNodes[this._currentIndex++];
  }

  throw new Error('Iterator has no more nodes');
};
