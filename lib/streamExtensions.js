var VerticesToVerticesStream = require('./streams/verticesToVerticesStream'),
    VerticesPipe = require('./streams/vertexPipe'),
    PathStream = require('./streams/pathStream'),
    EdgesToVerticesPipe = require('./streams/edgesToVerticesPipe'),
    VerticesToEdgesPipe = require('./streams/verticesToEdgesPipe');

module.exports = extendGraphStreams;

function extendGraphStreams() {
  var verticesStreams = [VerticesPipe, EdgesToVerticesPipe];
  var edgesStreams = [VerticesToEdgesPipe];

  verticesStreams.forEach(function(stream) {
    extendVerticesStream(stream.prototype);
  });
  edgesStreams.forEach(function(stream) {
    extendEdgesStream(stream.prototype);
  });
}

function extendVerticesStream(sourceStreamPrototype) {
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

  sourceStreamPrototype.path = function (filter) {
    return this.pipe(new PathStream(this._graph));
  };

  sourceStreamPrototype.outE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'out', filter));
  };

  sourceStreamPrototype.inE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'in', filter));
  };

  sourceStreamPrototype.bothE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'both', filter));
  };
}

function extendEdgesStream(sourceStreamPrototype) {
  sourceStreamPrototype.outV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'out', filter));
  };

  sourceStreamPrototype.inV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'in', filter));
  };

  sourceStreamPrototype.bothV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'both', filter));
  };
}
