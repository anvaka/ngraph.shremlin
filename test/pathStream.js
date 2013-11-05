var gods = require('./data/graphOfGodsData')(),
    g = require('..')(gods),
    test = require('tap').test;

test('Get path from Hercules', function (t) {
  t.plan(5);
  g.V('hercules')
   .out()
   .path()
   .on('data', function(path) {
     t.equal(path.length, 2, 'All out paths should be 1 item long');
   });
});
