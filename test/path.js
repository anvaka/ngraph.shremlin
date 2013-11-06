var gods = require('./data/graphOfGodsData')(),
    g = require('..')(gods),
    test = require('tap').test;

test('Get path from Hercules', function (t) {
  t.test('All paths starts from Hercules', function (t) {
    t.plan(10);
    g.V('hercules')
     .out()
     .path()
     .forEach(function(path) {
       t.equal(path.length, 2, 'All out paths should be 2 item long');
       t.equal(path[0].id, 'hercules', 'All paths starts at Hercules');
     });
  });

  t.test('Who is your father path', function (t) {
    t.plan(1);
    g.V('hercules')
     .out('father')
     .path()
     .forEach(function (path) {
       t.equal(path[1].id, 'jupiter', 'Father of Hercules is Jupiter');
     });
  });
  t.test('Who is your grandfather path', function (t) {
    t.plan(1);
    g.V('hercules')
     .out('father').out('father')
     .path()
     .forEach(function (path) {
       t.equal(path[2].id, 'saturn', 'Grandfather of Hercules is Saturn');
     });
  });
  // edges?
  t.test('Who is your father path with edges', function (t) {
    t.plan(3);
    g.V('hercules')
     .outE('father').inV()
     .path()
     .forEach(function (path) {
       t.equal(path[1].fromId, 'hercules', 'Start node should be Hercules');
       t.equal(path[1].toId, 'jupiter', 'End node should be Jupiter');
       t.equal(path[2].id, 'jupiter', 'Father of Hercules is Jupiter');
     });
  });
  // let's do complext loop:
  // hercules > father > brother > pet > {action: 'battled'}
  t.test('Who battled pet of Hercules father\'s brother?', function (t) {
    var battled = {action: 'battled'};
    t.plan(5);

    g.V('hercules')
     .out('father')
     .out('brother')
     .out('pet')
     .in(battled)
     .path()
     .forEach(function (path) {
       t.equal(path[0].id, 'hercules', 'Started from Hercules');
       t.equal(path[1].id, 'jupiter', 'Went to Jupiter');
       t.equal(path[2].id, 'pluto', 'Brother was Pluto');
       t.equal(path[3].id, 'cerberus', 'Pluto\'s pet was Cerberus');
       t.equal(path[4].id, 'hercules', 'And Hercules batteled Cerberus');
     });
  })
});
