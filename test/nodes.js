var test = require('tap').test,
    shremlin = require('..'),
    generators = require('ngraph.generators');

test('Get all nodes', function (t) {
  t.plan(10);

  var pathGraph = generators.path(10);
  g = shremlin(pathGraph);

  g.V().on('data', function (vertex) {
    t.ok(vertex, "Vertex should be present");
  });
});

test('Get specific node', function(t) {
  t.plan(1);

  var pathGraph = generators.path(10),
      startNodeId = 0;
  g = shremlin(pathGraph);

  g.V(startNodeId).on('data', function (vertex) {
    t.equal(vertex.id, startNodeId, "Start vertext should be valid");
  });
});

test('Get adjacent vertices', function(t) {
  var graphSize = 5,
      graph = generators.complete(graphSize),
      startNodeId = 0;

  t.plan(graphSize - 1);

  g = shremlin(graph);
  g.V(startNodeId)
    .out()
    .on('data', function (vertex) {
      t.notEqual(vertex.id, startNodeId, "None of the adjacent vertices should be equal to start node");
    });
});

test('Get adjacent of adjacent', function(t) {
  var graphSize = 5,
      graph = generators.path(graphSize),
      startNodeId = 0;

  t.plan(1);

  g = shremlin(graph);
  g.V(startNodeId)
    .out()
    .out()
    .on('data', function (vertex) {
      t.equal(vertex.id, 2, "Adjacent node should be 2");
    });
});
