/**
 * # ngraph.shremlin
 * This is a graph traversal library, inspired by
 * [gremlin](https://github.com/tinkerpop/gremlin)
 *
 * It allows to create complex graph traversal patterns by using simple
 * construction blocks. To best understand shremlin, let's start with example
 *
 * ```
 *   // Let's say we have this oriented, 3x3 grid graph:
 *   // 0 → 1 → 2
 *   // ↓   ↓   ↓
 *   // 3 → 4 → 5
 *   // create graph iterator:
 *   var g = shremlin(graph);
 *
 *   // How to iterate all graph vertices?
 *   g.V()
 *    .forEach(function(vertex) {
 *      console.log(vertex.id); // prints 0..5;
 *    });
 *
 *   // How to get vertex with id "1"?
 *   g.V(1)
 *    .forEach(function(vertex) {
 *      console.log(vertex.id); // prints only 1;
 *    });
 *
 *   // Let's print all neighbors of vertex 1, reachable via
 *   // outgoing edge:
 *   g.V(1)
 *    .out() // get all outgoing neighbors.
 *    .forEach(function(vertex) {
 *      console.log(vertex.id); // prints 2, 4;
 *    });
 *
 *   // How about roots of incoming edges?
 *   g.V(1)
 *    .in() // get all "incoming" neighbors
 *    .forEach(function(vertex) {
 *      console.log(vertex.id); // prints 0;
 *    });
 * ```
 *
 * Now that you understand basics, let's move on to the file
 */

"use strict";

module.exports = createGraphIterators;

/**
 * Creates a wrapper to iterate over graph. A wrapper contains methods which
 * allows you to begin iteration. Currently we support only vertices as iterator
 * starters, but in future we can easily extend this and add edges
 *
 * @param {ngraph.graph|Viva.Graph.graph} graph source graph we want to iterate over
 *
 */
function createGraphIterators(graph) {
  return {
    /**
     * Creates a vertex iterator stream. This is an entry point for all traversal
     * starting with a node.
     *
     * @param  {string|number} [startFrom] vertex id to start iteration from.
     *  If this argument is ommitted, then all graph nodes are iterated
     *
     * @returns {VertexPipe}
     */
    V: function createVertexStream(startFrom) {
      var VertexPipe = require('./lib/pipes/vertexPipe');
      var VertexIterator = require('./lib/utils/vertexIterator');

      var vertexPipe = new VertexPipe(graph);
      vertexPipe.setSourcePipe(new VertexIterator(graph, startFrom));
      return vertexPipe;
    }
  };
};

// Add syntatic sugar on top of each iterator, so that you can
// chain them together.
var extendIterators = require('./lib/pipeExtensions');
extendIterators();
