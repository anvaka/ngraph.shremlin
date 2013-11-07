ngraph.shremlin
===============

Shremlin is a graph traversal library, written in pure javascript, and inspired by [gremlin](https://github.com/tinkerpop/gremlin). Shremlin is compatible with both [vivagraph.js](https://github.com/anvaka/VivaGraphJS) and [ngraph.graph](https://github.com/anvaka/ngraph.graph) graph structures.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.shremlin.png)](http://travis-ci.org/anvaka/ngraph.shremlin)

Start
=====

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
