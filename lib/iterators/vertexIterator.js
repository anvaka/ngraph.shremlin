/**
 * # Vertex Iterator
 *
 * Since neither [VivaGraph](https://github.com/anvaka/VivaGraphJS) nor
 * [ngraph.graph](https://github.com/anvaka/ngraph.graph) currently support
 * iterators to iterate over edges or vertices, we build this facility here.
 * Ideally though, it should be part of those libraries (*TODO*).
 */

module.exports = VertexIterator;

/**
 * Vertex Iterator provides a simple wrapper over `graph.forEachNode`
 * to perform lazy iteration.
 */
function VertexIterator(graph, startFrom) {
  if (graph === undefined) {
    throw new Error('Graph is required by VertexIterator');
  }

  this._graph = graph;
  this._startFrom = startFrom;
  this._currentIndex = 0;
  this._allNodes = [];
  this._initialized = false;
  this._current = undefined;
}

VertexIterator.prototype.moveNext = function () {
  if (!this._initialized) {
    initialize.call(this);
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

function initialize() {
  var graph = this._graph,
      util = require('util'),
      node;
  if (util.isArray(this._startFrom)) {
    for (var i = 0; i < this._startFrom.length; ++i) {
      node = graph.getNode(this._startFrom[i]);
      if (node) {
        this._allNodes.push(node);
      }
    }
  } else if (this._startFrom !== undefined) {
    node = graph.getNode(this._startFrom);
    if (node) { this._allNodes.push(node); }
  } else {
    // TODO: that's why this should be done within ngraph.graph:
    var allNodes = this._allNodes;
    this._graph.forEachNode(function (node) {
      allNodes.push(node);
    });
  }
}
