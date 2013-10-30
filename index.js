"use strict";

module.exports = function(graph) {
  return {
    V: createVertexStream
  };
}

function createVertexStream(startFrom) {
  var VertexStream = require('./lib/vertexStream');
  return new VertexStream(graph, startFrom);
}
