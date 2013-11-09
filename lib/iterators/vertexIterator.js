'use strict';
// simple wrapper over graph.forEachNode
// to perform lazy iteration
// Todo: this facility should probably be provided by ngraph.graph itself

module.exports = VertexIterator;

function VertexIterator(graph, startFrom) {
  this._graph = graph;
  this._startFrom = startFrom;
  this._currentIndex = 0;
  this._allNodes = [];
  this._initialized = false;
  this._current = undefined;

  if (typeof startFrom !== 'undefined') {
    var node = graph.getNode(startFrom);
    if (node) {
      this._allNodes.push(node);
    }
    this._initialized = true;
  }
}

VertexIterator.prototype.moveNext = function () {
  if (!this._initialized) {
    // TODO: that's why this should be done within ngraph.graph:
    var iterator = this;
    this._allNodes = [];
    this._graph.forEachNode(function (node) {
      iterator._allNodes.push(node);
    });
    this._initialized = true;
  }

  if (this._currentIndex < this._allNodes.length) {
    this._current = this._allNodes[this._currentIndex++];
    return true;
  }

  return false;
};

VertexIterator.prototype.current = function () {
  return this._current;
};
