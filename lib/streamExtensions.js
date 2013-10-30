var VerticesToVerticesStream = require('./verticesToVerticesStream');

module.exports = function (sourceStreamPrototype) {
  /**
   * Pipes source stream of vertices into stream which
   * produces adjacent vertices, connected by head of an edge.
   *
   * Example:
   *   A -> B -> C
   *   g.V('B').out() - emits C
   */
  sourceStreamPrototype.out = function (filter) {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'out', filter));
  };

  /**
   * Pipes source stream of vertices into stream which
   * produces adjacent vertices, connected by tail of an edge.
   *
   * Example:
   *   A -> B -> C
   *   g.V('B').in() - emits A
   */
  sourceStreamPrototype.in = function (filter) {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'in', filter));
  };

  /**
   * Pipes source stream of vertices into stream which
   * produces adjacent vertices from both sides of an edge
   *
   * Example:
   *   A -> B -> C
   *   g.V('B').both() - emits A and C
   */
  sourceStreamPrototype.both = function (filter) {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'both', filter));
  };
}
