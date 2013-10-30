var test = require('tap').test,
    createFilter = require('../lib/filterExpression');

test('Can match simple types', function (t) {
  var matchHello = createFilter('hello');
  t.ok(matchHello('hello'), 'Should match strings');
  t.notOk(matchHello('Hello'), 'Should be case sensitive');
  t.notOk(matchHello('hello world'), 'Should not do partial match');
  t.notOk(matchHello(''), 'Should not match with empty string');
  t.notOk(matchHello(1), 'Should not match with non strings');
  t.notOk(matchHello('world'), 'Should not match when there is no match');
  t.notOk(matchHello(), 'Should not match with undefined');
  t.end();
});
