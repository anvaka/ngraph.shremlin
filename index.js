"use strict";

module.exports = function(graph) {
  return {
    V: function createVertexStream(startFrom) {
      var VertexStream = require('./lib/vertexStream');
      return new VertexStream(graph, startFrom);
    }
  };
};
