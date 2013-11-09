/**
 * # Edge Iterator
 *
 * Since neither [VivaGraph](https://github.com/anvaka/VivaGraphJS) nor
 * [ngraph.graph](https://github.com/anvaka/ngraph.graph) currently support
 * iterators to iterate over edges or vertices, we build this facility here.
 * Ideally though, it should be part of those libraries (*TODO*).
 */

module.exports = createEdgeIterator;

/**
 * This iterator iterates over all edges for a given vertex.
 * You can optionally pass a `matchFilter(edge, vertexId)` callback,
 * to decide whether or not you want to include given edge into results.
 *
 * Example (Iterate over all edges):
 * ```
 *  var startFrom = graph.getNode(42),
 *      edges = createEdgeIterator(startFrom);
 *
 *  while(edges.moveNext()) {
 *    // print all edges (incoming and outgoing)
 *    console.log(edges.current());
 *  }
 * ```
 *
 * Example (Iterate over incoming edges):
 * ```
 *  var startFrom = graph.getNode(42),
 *      incomingOnly = function (edge, vertexId) {
 *        return edge.toId === vertexId;
 *      },
 *      edges = createEdgeIterator(startFrom, incomingOnly);
 *
 *  while(edges.moveNext()) {
 *    // print incoming edges only
 *    console.log(edges.current());
 *  }
 * ```
 */
function createEdgeIterator(vertex, matchFilter) {
  if (vertex === undefined) {
    throw new Error('Vertex should be defined in edge iterator');
  }

  matchFilter = typeof matchFilter === 'function' ?
                  matchFilter : function () { return true; };

  // We rely on internal structure of vertex here. Which is not good.
  // This is one of the reasons why I think this code belongs to core library
  var links = vertex.links,
      currentEdge = undefined,
      currentIdx = 0;

  return {
    moveNext: function () {
      while (currentIdx < links.length) {
        var edge = links[currentIdx++];
        if (matchFilter(edge, vertex.id)) {
          currentEdge = edge;
          return true;
        }
      }
      return false;
    },
    current: function () {
      return currentEdge;
    }
  };
}
