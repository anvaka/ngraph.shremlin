var test = require('tap').test,
    shremlin = require('..'),
    generators = require('ngraph.generators');

test('Get all nodes', function (t) {
  t.plan(10);

  var pathGraph = generators.path(10);
  g = shremlin(pathGraph);

  g.V().on('data', function (vertex) {
    t.ok(vertex);
  });

  t.end();
});

test('Get specific node', function(t) {
  t.plan(1);

  var pathGraph = generators.path(10),
      startNodeId = 0;
  g = shremlin(pathGraph);

  g.V(startNodeId).on('data', function (vertex) {
    t.equal(vertex.id, startNodeId, "Unexpected start node");
  });

  t.end();
});
