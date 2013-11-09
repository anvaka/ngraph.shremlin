/**
 * # Path Pipe
 *
 * PathPipe allows clients to understand how traversal algorithm
 * reached given node. It takes as a source any type of `BasePipe`
 * child, and emits array of objects (vertices, edges, etc.) through
 * which it went to reach final point
 *
 * Example of traversal for [Graph of Gods](https://raw.github.com/wiki/thinkaurelius/titan/images/graph-of-the-gods-2.png):
 *
 * ```
 *   g.V('hercules')  // get 'hercules' vertex
 *    .out('father')  // Who is father of Hercules?
 *    .out('brother') // Get all Hercules uncles
 *    .out('pet')     // Get pets of Hercules uncles.
 *    .path()         // Get traversal path
 *    .forEach(function (path) {
 *      // path is array of vertices
 *      // [hercules] -> [father] -> [brother] -> [pet]
 *      console.log(path);
 *    });
 * ```
 */

module.exports = PathPipe;

// See also: [BasePipe](../basePipe.html)
var BasePipe = require('../basePipe'),
    util = require('util');

util.inherits(PathPipe, BasePipe);

function PathPipe(graph) {
  if (!(this instanceof PathPipe)) {
    return new PathPipe(graph);
  }
  this._graph = graph;
  BasePipe.call(this);
}

PathPipe.prototype._moveNext = function () {
  if (this._sourcePipe.moveNext()) {
    this._current = this._sourcePipe.getCurrentPath();
    return true;
  }
  return false;
};
