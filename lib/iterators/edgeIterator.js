module.exports = createEdgeIterator;

function createEdgeIterator(startFrom, matchFilter) {
  // This should be part of ngraph.graph, I believe
  var links = startFrom.links,
      currentEdge = undefined,
      currentIdx = 0;

  return {
    moveNext: function () {
      while (currentIdx < links.length) {
        var edge = links[currentIdx++];
        if (matchFilter(edge, startFrom.id)) {
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
