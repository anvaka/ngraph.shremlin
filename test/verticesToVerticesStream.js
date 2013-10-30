var test = require('tap').test,
    shremlin = require('..'),
    createGraph = require('ngraph.graph');

test('Test VerticesToVertices stream', function(t) {
  // this is our test graph:
  // 1 -> 2 <- 3
  //      v
  // 6 <- 4 -> 5
  var graph = createGraph();
  graph.addLink(1, 2); graph.addLink(3, 2);
  graph.addLink(2, 4); graph.addLink(4, 5); graph.addLink(4, 6);
  g = shremlin(graph);

  t.test('4 > out', function (t) {
    t.plan(2); // node 4 has only two out edges
    g.V(4)
      .out()
      .on('data', function (vertex) {
        t.ok(vertex.id === 6 || vertex.id === 5, "Vertex 4 connected to correct neighbors");
      });
  });

  t.test('2 > out | out', function (t) {
    t.plan(2);
    g.V(2)
      .out().out()
      .on('data', function (vertex) {
        t.ok(vertex.id === 6 || vertex.id === 5, "Vertex 4 connected to correct neighbors");
      });
  });

  t.test('4 > in | out', function (t) {
    t.plan(1);
    g.V(4)
      .in().out()
      .on('data', function (vertex) {
        t.ok(vertex.id === 4, "Vertex 4 should be the only out node of vertex 2");
      });
  });

  t.test('2 > out | in', function (t) {
    t.plan(1);
    g.V(2)
      .out().in()
      .on('data', function (vertex) {
        t.ok(vertex.id === 2, "Vertex 2 should be the only in node of vertex 4");
      });
  });

  t.test('2 > both', function (t) {
    t.plan(3);
    g.V(2)
      .both()
      .on('data', function (vertex) {
        t.ok([1, 3, 4].indexOf(vertex.id) !== -1, "Vertex 2 should be connected with 1, 3 and 4");
      });
  });

  t.test('2 > both | in', function (t) {
    t.plan(1);
    g.V(2)
      .both().in()
      .on('data', function (vertex) {
        t.equal(vertex.id, 2, "Vertex 2 should be the only possible in");
      });
  });
  // Graph reminder:
  // 1 -> 2 <- 3
  //      v
  // 6 <- 4 -> 5
  t.test('2 > both | out', function (t) {
    t.plan(4);
    g.V(2)
      .both().out()
      .on('data', function (vertex) {
        t.ok([2, 6, 5].indexOf(vertex.id) !== -1);
      });
  });

  t.test('2 > both | both', function (t) {
    t.plan(5);
    g.V(2)
      .both().both()
      .on('data', function (vertex) {
        t.ok([6, 5, 2].indexOf(vertex.id) !== -1);
      });
  });

  t.test('2 > in | in', function (t) {
    g.V(2)
      .in().in()
      .on('data', function (vertex) {
        t.fail("There is no 'in' nodes for 1 and 3");
      }).on('end', function() { t.end(); });
  });
});

test('Filter stream', function (t) {
  // graph is:
  // 1 → 2
  // ↓ ↘
  // 3   4
  var graph = createGraph();
  graph.addNode(1, {score: 5});
  graph.addNode(2, {score: 10});
  graph.addNode(3, {score: 20});
  graph.addNode(4, {score: 10});

  graph.addLink(1, 2); graph.addLink(1, 3); graph.addLink(1, 4);
  g = shremlin(graph);
  t.test('Out adjacent with score 10', function (t) {
    t.plan(2);
    g.V(1)
     .out({score: 10})
     .on('data', function (vertex) {
       t.ok([2, 4].indexOf(vertex.id) > -1, 'Only 2 and 4 has score 10');
     });
  });

  t.test('Out adjacent with score > 10', function (t) {
    t.plan(1);
    g.V(1)
     .out(function(vertex) { return vertex.data.score > 10; })
     .on('data', function (vertex) {
       t.equal(vertex.id, 3, 'Only 3 has score > 10');
     });
  });

  t.test('1 | out[score 10] | in[score 5]', function (t) {
    t.plan(2);
    g.V(1)
     .out({score: 10})
     .in({score: 5})
     .on('data', function (vertex) {
       t.equal(vertex.id, 1, 'Only 1 has score 5');
     });
  });
});
