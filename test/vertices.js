'use strict'

var test = require('tap').test,
    shremlin = require('..'),
    generators = require('ngraph.generators');

test('Get all nodes', function (t) {
  t.plan(10);

  var pathGraph = generators.path(10),
      g = shremlin(pathGraph);

  g.V().forEach(function (vertex) {
    t.ok(vertex, "Vertex should be present");
  });
});

test('Get specific node', function(t) {
  t.plan(1);

  var pathGraph = generators.path(10),
      startNodeId = 0,
      g = shremlin(pathGraph);

  g.V(startNodeId).forEach(function (vertex) {
    t.equal(vertex.id, startNodeId, "Start vertext should be valid");
  });
});

test('Get multiple nodes', function(t) {
  var pathGraph = generators.path(10),
      startNodeIds = [0, 1, 2],
      g = shremlin(pathGraph);

  t.plan(startNodeIds.length);

  g.V(startNodeIds).forEach(function (vertex) {
    t.ok(startNodeIds.indexOf(vertex.id) > -1, "Start vertext should be valid");
  });
});

test('Get nodes matching predicate', function(t) {
  var pathGraph = generators.path(10),
      vertexFilter = function (v) {
        return v.id < 2; // it's only 0, 1 and 2
      },
      g = shremlin(pathGraph);


  debugger;
  g.V(vertexFilter).forEach(function (vertex) {
    t.ok(vertexFilter(vertex), "Start vertext should be valid");
  });
  t.end();
});
