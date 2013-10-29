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
  sourceStreamPrototype.out = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'out'));
  };

  /**
   * Pipes source stream of vertices into stream which
   * produces adjacent vertices, connected by tail of an edge.
   *
   * Example:
   *   A -> B -> C
   *   g.V('B').in() - emits A
   */
  sourceStreamPrototype.in = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'in'));
  };

  /**
   * Pipes source stream of vertices into stream which
   * produces adjacent vertices from both sides of an edge
   *
   * Example:
   *   A -> B -> C
   *   g.V('B').both() - emits A and C
   */
  sourceStreamPrototype.both = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'both'));
  };
}
