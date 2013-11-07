var test = require('tap').test,
    shremlin = require('..'),
    createGraph = require('ngraph.graph');

test('visit all edges', function (t) {
  // this is our test graph:
  // 1 -> 2 <- 3
  //      v
  // 6 <- 4 -> 5
  var graph = createGraph();
  graph.addLink(1, 2); graph.addLink(3, 2);
  graph.addLink(2, 4); graph.addLink(4, 5); graph.addLink(4, 6);
  g = shremlin(graph);

  t.test('4 | outE', function (t) {
    t.plan(2);
    g.V(4)
      .outE()
      .forEach(function (edge) {
        t.ok(edge.fromId === 4 && ([6, 5].indexOf(edge.toId) > -1), "Outgoing edges from vertex 4 connect to correct neighbors");
      });
  });


  t.test('2 | inE', function (t) {
    t.plan(2);
    g.V(2)
      .inE()
      .forEach(function (edge) {
        t.ok(edge.toId === 2 && ([1, 3].indexOf(edge.fromId) > -1), "Incoming edges to vertex 2 connect from correct neighbors");
      });
  });
  t.test('2 | bothE', function (t) {
    t.plan(6); // six because we have 3 edges times two asserts
    g.V(2)
      .bothE()
      .forEach(function (edge) {
        t.ok(edge.toId === 2 || edge.toId === 4, "To ids are only 2 and 4");
        t.ok([1, 2, 3].indexOf(edge.fromId) >= -1, "From ids are 1 2 and 3");
      });
  });
});

test('Visit filtered edges', function (t) {
  var graph = createGraph();
  graph.addLink(1, 3, 'mother');
  graph.addLink(1, 4, 'father'); graph.addLink(5, 1, 'father');

  g = shremlin(graph);
  t.plan(5);
  g.V(5)
   .outE('father')
   .forEach(function (edge) {
     t.equal(edge.toId, 1, 'Father of 5 is 1');
   });

  g.V(5)
   .outE('father')
   .inV()
   .outE('father')
   .forEach(function(edge) {
     t.equal(edge.toId, 4, 'Father of 1 is 4');
   });

  g.V(5)
   .outE('father')
   .bothV()
   .forEach(function(vertex) {
     t.ok([5, 1].indexOf(vertex.id) > -1, 'Both 1 and 5 should be returned');
   });

  g.V(5)
   .outE('father')
   .outV()
   .forEach(function(vertex) {
     t.equal(vertex.id, 5, 'Should come back to where it started');
   });
});
