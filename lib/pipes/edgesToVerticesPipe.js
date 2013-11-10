/**
 * # Edges to Vertices pipe
 *
 * This pipe take a `edge` as an input, and emits `vertices` as an output.
 */
module.exports = EdgesToVerticesPipe;

// See also: [BasePipe](../basePipe.html)
var BasePipe = require('../basePipe'),
    util = require('util');

util.inherits(EdgesToVerticesPipe, BasePipe);

/**
 * Depending on `mode` emitted vertices are:
 *
 * * `out` - emits vertex at the tail of an edge (`A->B`, emits `B`)
 * * `in` - emits vertex at the head of an edge (`A->B`, emits `A`)
 * * `both` - emits both `in` and `out` vertices (`A->B` emits `A` and `B`)
 *
 * See [Syntactic Sugar](../pipeSugar.html) for more examples;
 */
function EdgesToVerticesPipe(graph, mode) {
  if (!(this instanceof EdgesToVerticesPipe)) {
    return new EdgesToVerticesPipe(graph, mode);
  }
  BasePipe.call(this);

  this._graph = graph;
  this._mode = mode;
  this._fromNode = null;
  this._toNode = null;

  if (mode === 'out') {
    this._updateFromAndToNodes = function (edge) {
      this._fromNode = graph.getNode(edge.fromId);
      this._toNode = null;
    };
  } else if (mode === 'in') {
    this._updateFromAndToNodes = function (edge) {
      this._fromNode = null;
      this._toNode = graph.getNode(edge.toId);
    };
  } else if (mode === 'both') {
    this._updateFromAndToNodes = function (edge) {
      this._fromNode = graph.getNode(edge.fromId);
      this._toNode = graph.getNode(edge.toId);
    };
  } else {
    throw new Error("Unsupported mode of EdgesToVerticesPipe. Expected (out|in|both), got: " + mode);
  }
}

EdgesToVerticesPipe.prototype._moveNext = function () {
  while (true) {
    if (this._fromNode) {
      this._current = this._fromNode;
      this._fromNode = null;
      return true;
    } else if (this._toNode) {
      this._current = this._toNode;
      this._toNode = null;
      return true;
    }
    if (this._sourcePipe.moveNext()) {
      // get the next edge and find out which nodes should be visited:
      var edge = this._sourcePipe.current();
      this._updateFromAndToNodes(edge);
      // next iteration will check _from and _to nodes, and emit them
    } else {
      return false;
    }
  }
};
