var graphOfGods = require('./graphOfGodsData')(),
    test = require('tap').test,
    shremlin = require('../');

test('battled more than once', function(t) {
  t.plan(2);
  var g = shremlin(graphOfGods);
  g.V('hercules')
   .outE(function(edge) {
     var data = edge.data;
     return data.action === 'battled' && data.times > 1;
   })
   .inV()
   .on('data', function (vertex) {
     t.ok(['hydra', 'cerberus'].indexOf(vertex.id) !== -1, 'Hydra and Cerberus');
   });
});
