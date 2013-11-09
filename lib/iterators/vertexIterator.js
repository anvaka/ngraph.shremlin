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
 *
 * `startFrom` argument is optional and has the following meaning:
 *
 * _Not passed_ - Iterate over all vertices of a `graph`:
 * ```
 *   var iterator = new VertexIterator(graph);
 *
 *   while (iterator.moveNext()) {
 *     // prints all vertices:
 *     console.log(iterator.current());
 *   }
 * ```
 *
 * _Array_ - Iterate over all vertices with matching identifiers from array:
 * ```
 *   var iterator = new VertexIterator(graph, [0, 1]);
 *
 *   while (iterator.moveNext()) {
 *     // prints two vertices with identifier 0 or 1:
 *     console.log(iterator.current());
 *   }
 * ```
 *
 * _Function_ - Iterate over all vertices which match function predicate:
 * ```
 *   var filter = function (vertex) { return false; },
 *       iterator = new VertexIterator(graph, filter);
 *
 *   while (iterator.moveNext()) {
 *     console.log('This will never be shown');
 *   }
 * ```
 *
 * _Anything else_ - Consider it as starting vertex id:
 * ```
 *   var iterator = new VertexIterator(graph, 42);
 *
 *   while (iterator.moveNext()) {
 *     // this will print single node with id == 42;
 *     console.log(iterator.current());
 *   }
 * ```
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
      debugger;
  if (util.isArray(this._startFrom)) {
    for (var i = 0; i < this._startFrom.length; ++i) {
      node = graph.getNode(this._startFrom[i]);
      if (node) {
        this._allNodes.push(node);
      }
    }
  } else if (!/function|undefined/.test(typeof this._startFrom)) {
    node = graph.getNode(this._startFrom);
    if (node) {
      this._allNodes.push(node);
    }
  } else {
    var filterPredicate = this._startFrom || function () { return true; };

    // Unfortunately this means we have to visit each node of the graph
    // Which makes "lazy" initialization not so lazy. Idially this should be
    // fixed within core librarires (vivagraph or ngraph):
    var allNodes = this._allNodes;
    this._graph.forEachNode(function (node) {
      if (filterPredicate(node)) {
        allNodes.push(node);
      }
    });
  }
}
