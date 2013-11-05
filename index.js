"use strict";

module.exports = function(graph) {
  return {
    V: function createVertexStream(startFrom) {
      var VertexStream = require('./lib/streams/vertexStream');
      return new VertexStream(graph, startFrom);
    }
  };
};

var extendGraphStreams = require('./lib/streamExtensions');
extendGraphStreams();
