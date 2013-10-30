var test = require('tap').test,
    createFilter = require('../lib/filterExpression');

// in ngraph.* all links and nodes store associated data within
// 'data' proprerty. This test supposed to verify maches against data properties
test('Can match simple types', function (t) {
  var matchHello = createFilter('hello');
  t.ok(matchHello({data: 'hello'}), 'Should match strings');
  t.notOk(matchHello({data: 'Hello'}), 'Should be case sensitive');
  t.notOk(matchHello({data: 'hello world'}), 'Should not do partial match');
  t.notOk(matchHello({data: ''}), 'Should not match with empty string');
  t.notOk(matchHello({data: 1}), 'Should not match with non strings');
  t.notOk(matchHello({data: 'world'}), 'Should not match when there is no match');
  t.notOk(matchHello(), 'Should not match with undefined');

  var matchNumber = createFilter(42);
  t.ok(matchNumber({ data: 42 }), 'Should match strings');
  t.notOk(matchNumber({ data: 1 }), 'Should not match with non strings');
  t.notOk(matchNumber(), 'Should not match with undefined');
  t.end();
});

