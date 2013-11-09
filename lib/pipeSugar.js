/**
 * # Syntactic Sugar
 *
 * Syntax of Shremlin if far from being user friendly. I tried to follow
 * conventions of [gremlin](https://github.com/tinkerpop/gremlin), which
 * has its own pros and cons. New users may be terrified, while users familiar
 * with gremlin will meet old friends.
 *
 * Example:
 *
 * ```
 *   g.V(42)  // Start from vertex with id == 42
 *    .outE() // visit all outgoing Edges
 *    .inV()  // visit vertices at edge heads.
 *    .out()  // get out-adjacent vertices
 *    .both() // get both in and out adjacent vertices
 * ```
 *
 * I was thinking about adding more verbose aliases for each chainable
 * method. Let me know if that makes sense.
 *
 */

module.exports = augmentPipesSyntax;

/**
 * Augment each known pipe type with gremlin-like syntax
 */
var VerticesToVerticesPipe = require('./pipes/verticesToVerticesPipe'),
    VerticesPipe        = require('./pipes/vertexPipe'),
    PathPipe            = require('./pipes/pathPipe'),
    EdgesToVerticesPipe = require('./pipes/edgesToVerticesPipe'),
    VerticesToEdgesPipe = require('./pipes/verticesToEdgesPipe');

function augmentPipesSyntax() {
  var verticesPipes = [VerticesPipe, VerticesToVerticesPipe, EdgesToVerticesPipe];
  var edgesPipes = [VerticesToEdgesPipe];

  verticesPipes.forEach(function(pipe) {
    augmentVerticesPipes(pipe.prototype);
  });

  edgesPipes.forEach(function(pipe) {
    augmentEdgesPipes(pipe.prototype);
  });
}

// Pipes which take Vertices as input
// ----------------------------------

function augmentVerticesPipes(srcPipePrototype) {
  /**
   * Pipes source to [VerticesToVerticesPipe](pipes/verticesToVerticesPipe.html)
   * which produces adjacent vertices, connected by head of an edge.
   *
   * Example:
   * ```
   *   A -> B -> C
   *   g.V('B').out(); // emits C
   * ```
   */
  srcPipePrototype.out = function (filter) {
    return this.pipe(new VerticesToVerticesPipe(this._graph, 'out', filter));
  };

  /**
   * Pipes source to [VerticesToVerticesPipe](pipes/verticesToVerticesPipe.html)
   * which produces adjacent vertices, connected by tail of an edge.
   *
   * Example:
   * ```
   *   A -> B -> C
   *   g.V('B').in() - emits A
   * ```
   */
  srcPipePrototype.in = function (filter) {
    return this.pipe(new VerticesToVerticesPipe(this._graph, 'in', filter));
  };

  /**
   * Pipes source to [VerticesToVerticesPipe](pipes/verticesToVerticesPipe.html)
   * which produces adjacent vertices from both sides of an edge
   *
   * Example:
   * ```
   *   A -> B -> C
   *   g.V('B').both() - emits A and C
   * ```
   */
  srcPipePrototype.both = function (filter) {
    return this.pipe(new VerticesToVerticesPipe(this._graph, 'both', filter));
  };

  /**
   * Pipes source to [VerticesToEdgesPipe](pipes/verticesToEdgesPipe.html)
   * which produces outgoing edges
   *
   * Example:
   * ```
   *   A -- edge AB --> B -- edge BC --> C
   *   g.V('B').outE() - emits [edge BC]
   * ```
   */
  srcPipePrototype.outE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'out', filter));
  };

  /**
   * Pipes source to [VerticesToEdgesPipe](pipes/verticesToEdgesPipe.html)
   * which produces incoming edges
   *
   * Example:
   * ```
   *   A -- edge AB --> B -- edge BC --> C
   *   g.V('B').inE() - emits [edge AB]
   * ```
   */
  srcPipePrototype.inE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'in', filter));
  };

  /**
   * Pipes source to [VerticesToEdgesPipe](pipes/verticesToEdgesPipe.html)
   * which produces both incoming and outgoing edges
   *
   * Example:
   * ```
   *   A -- edge AB --> B -- edge BC --> C
   *   g.V('B').outE() - emits [edge BC] and [edge AB]
   * ```
   */
  srcPipePrototype.bothE = function (filter) {
    return this.pipe(new VerticesToEdgesPipe(this._graph, 'both', filter));
  };

  /**
   * Pipes source to [PathPipe](pipes/pathPipe.html)
   * which produces array of objects (vertices, edges, etc.) through
   * which it went to reach final point
   *
   * Example:
   * ```
   *   A -- edge AB --> B -- edge BC --> C
   *   g.V('A')
   *    .outE()
   *    .inV() - emits [Vertex A, Edge AB, Vertex B]
   * ```
   */
  srcPipePrototype.path = function (filter) {
    return this.pipe(new PathPipe(this._graph));
  };
}

// Pipes which take edges as input
// ----------------------------------

function augmentEdgesPipes(srcPipePrototype) {
  /**
   * Returns vertices at the tail of an edge.
   *  E.g. `A --> B - returns A`
   */
  srcPipePrototype.outV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'out', filter));
  };

  /**
   * Returns vertices at the head of an edge.
   *  E.g. `A --> B - returns B`
   */
  srcPipePrototype.inV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'in', filter));
  };

  /**
   * Returns both from and to vertices of an edge
   *  E.g. `A --> B - returns A and B`
   */
  srcPipePrototype.bothV = function (filter) {
    return this.pipe(new EdgesToVerticesPipe(this._graph, 'both', filter));
  };
}
