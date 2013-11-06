"use strict";

module.exports = function(graph) {
  return {
    V: function createVertexStream(startFrom) {
      var VertexPipe = require('./lib/streams/vertexPipe');
      var VertexIterator = require('./lib/utils/vertexIterator');

      var vertexPipe = new VertexPipe(graph);
      vertexPipe.setStarts(new VertexIterator(graph, startFrom));
      return vertexPipe;
    }
  };
};

var extendGraphStreams = require('./lib/streamExtensions');
extendGraphStreams();
