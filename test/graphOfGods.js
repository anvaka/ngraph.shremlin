/*
// see https://raw.github.com/wiki/thinkaurelius/titan/images/graph-of-the-gods-2.png
// and https://github.com/thinkaurelius/titan/wiki/Getting-Started
// for more details about this graph
var graphOfGods = require('./data/graphOfGodsData')(),
    test = require('tap').test,
    shremlin = require('../');

test('hercules battled more than once', function(t) {
  t.plan(2);

  var g = shremlin(graphOfGods);
  g.V('hercules')
   .outE(battledMoreThanOnce)
   .inV()
   .on('data', function (vertex) {
     t.ok(['hydra', 'cerberus'].indexOf(vertex.id) !== -1, 'Hydra and Cerberus');
   });

  function battledMoreThanOnce(edge) {
     var data = edge.data;
     return data.action === 'battled' && data.times > 1;
   }
});

test('Oh pluto', function (t) {
  var g = shremlin(graphOfGods);
  var lives = {action: 'lives'}; // how are we filtering edges?

  t.test('Where do pluto\'s brothers live?', function (t) {
    t.plan(2);
    g.V('pluto')
     .out('brother')
     .out(lives)
     .on('data', function (vertex) {
       t.ok(['sky', 'sea'].indexOf(vertex.id) !== -1, 'Only on the sky and in the sea');
     });
  });

  t.test('Cohabiters of Tartarus', function (t) {
    t.plan(2);
    g.V('pluto')
     .out(lives)
     .in(lives)
     .on('data', function(vertex) {
       t.ok(['cerberus', 'pluto'].indexOf(vertex.id) !== -1, 'Only cerberus and pluto');
     });
  });
});
*/
