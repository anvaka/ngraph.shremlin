module.exports = VerticesToEdgesStream;

var BasePipe = require('../basePipe'),
    createEmptyIterator = require('../iterators/emptyIterator'),
    createEdgeIterator = require('../iterators/edgeIterator'),
    createFilter = require('../utils/filterExpression'),
    util = require('util');

util.inherits(VerticesToEdgesStream, BasePipe);

function VerticesToEdgesStream(graph, mode, filter) {
  if (!(this instanceof VerticesToEdgesStream)) {
    return new VerticesToEdgesStream(graph, mode, filter);
  }
  BasePipe.call(this);

  var customMatch = typeof filter !== 'undefined' ?
                     createFilter(filter) : function () { return true; }

  this._graph = graph;
  this._mode = mode;
  this._currentEdgesIterator = createEmptyIterator();
  if (mode === 'out') {
    this._matchModeFilter = function (edge, vertexId) {
      return edge.fromId === vertexId && customMatch(edge);
    }
  } else if (mode === 'in') {
    this._matchModeFilter = function (edge, vertexId) {
      return edge.toId === vertexId && customMatch(edge);
    }
  } else if (mode === 'both') {
    this._matchModeFilter = function (edge, vertexId) {
      return customMatch(edge);
    }
  } else {
    throw new Error("Unsupported mode of VerticesToEdgesStream. Expected (out|in|both), got: " + mode);
  }
}

VerticesToEdgesStream.prototype._moveNext = function () {
  while (true) {
    if (this._currentEdgesIterator.moveNext()) {
      this._current = this._currentEdgesIterator.current();
      return true;
    } else if (this._starts.moveNext()) {
      // there is no more edges for this node. Let's move forward to next node.
      this._currentEdgesIterator = createEdgeIterator(this._starts.current(), this._matchModeFilter);
      // next iteration of the outter loop will either return matching edge
      // or take next vertex or result in false response for _moveNext()
    } else {
      // there is no nodes to start from left
      return false;
    }
  }
};
