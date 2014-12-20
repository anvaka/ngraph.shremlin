ngraph.shremlin
===============

Shremlin is a graph traversal library, written in pure javascript, and inspired by [gremlin](https://github.com/tinkerpop/gremlin). Shremlin is compatible with both [vivagraph.js](https://github.com/anvaka/VivaGraphJS) and [ngraph.graph](https://github.com/anvaka/ngraph.graph) graph structures.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.shremlin.png)](http://travis-ci.org/anvaka/ngraph.shremlin)

Start
=====

The source code is heavily documented. You can read [formatted documentation](http://anvaka.github.io/ngraph.shremlin/).

Here is a quick snippet from documentation:

``` js
var shremlin = require('ngraph.shremlin');

// Let's say we have this oriented, 3x3 grid graph:
// 0 → 1 → 2
// ↓   ↓   ↓
// 3 → 4 → 5

// create graph iterator:
var g = shremlin(graph);
// How to iterate all graph nodes?
g.V()
 .forEach(function(node) {
   console.log(node.id); // prints 0..5;
 });

// How to get node with id "1"?
g.V(1)
 .forEach(function(node) {
   console.log(node.id); // prints only 1;
 });

// Let's print all neighbors of node 1, reachable via outgoing edge:
g.V(1)
 .out() // get all outgoing neighbors.
 .forEach(function(node) {
   console.log(node.id); // prints 2, 4;
 });

// How about roots of incoming edges?
g.V(1)
 .in() // get all "incoming" neighbors
 .forEach(function(node) {
   console.log(node.id); // prints 0;
 });

```

Shremlin uses simple composable steps to achieve complex iterations. E.g. this is how you can get all "grandchildren" of our graph:
``` js
// Remember our graph?
// 0 → 1 → 2
// ↓   ↓   ↓
// 3 → 4 → 5
g.V(1)
 .out() // first level children of node 1. It is node 2 and node 4
 .out() // second level children of node 1. I.e. children of node 2 and node 4. It is node 5
 .forEach(function(node) {
   console.log(node.id); // prints 5 two times
 });

// You can also print path through which we got to last node:
g.V(1)
 .out()
 .out()
 .path()
 .forEach(function(path) {
   // each element of the path is actual node instance.
   for(var i = 0; i < path.length; ++i) { console.log(path[i].id); }
 }); // prints 1, 2, 5 and 1, 4, 5
```

Word of caution
===============
This is all work in progress. Even at the current early stage this library is powerful enough to perform complex filtering during traversal. See [graph of gods](https://github.com/anvaka/ngraph.shremlin/blob/master/test/graphOfGods.js#L1) test for more info.
