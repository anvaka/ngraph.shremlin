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

test('Can use custom predicate', function (t) {
  t.test('verify predicate is called', function (t) {
    t.plan(2);
    var matchHello = createFilter(function (obj) {
      t.pass('Custom predicate should be called');
      return obj === 'hello';
    });
    t.ok(matchHello('hello'), 'Hello should match!');
  });

  t.test('verify object undefined is passed', function (t) {
    t.plan(2);
    var matchUndefined = createFilter(function (obj) {
      return typeof obj === 'undefined';
    });

    t.ok(matchUndefined(), 'Undefined should match!');
    t.notOk(matchUndefined('Hello'), 'Defined should not match');
  })
});

test('Can match with array', function (t) {
  var match123 = createFilter([1, 2, 3]);
  t.ok(match123({data: [1, 2, 3]}), 'Should match with the same array');
  t.ok(match123({data: {0:1, 1:2, 2:3, length: 3}}), 'Should match with array-like objects');
  t.notOk(match123({ data: [1, 2, 3, 4]}), 'Should check length');
  t.notOk(match123({ data: "123"}), 'Should do strict match');
  t.notOk(match123({ data: 123}), 'Should not match with non array-like objects');
  t.end();
});

test('Can match with object filter', function (t) {
  t.test('Match filter property', function (t) {
    var matchNameAndAge = createFilter({ name : 'John'});
    t.ok(matchNameAndAge({ data: {name: 'John'}}), 'Should match with full match');
    t.ok(matchNameAndAge({ data: {name: 'John', age: 42}}), 'Should match with more keys');
    t.notOk(matchNameAndAge({ data: {name: 'Johnson'}}), 'Should not match when one property does not match');
    t.notOk(matchNameAndAge(), 'Should not match when object is missing');
    t.end();
  });

  t.test('Match all filter properties', function (t) {
    var matchNameAndAge = createFilter({ name : 'John', age: 42});
    t.ok(matchNameAndAge({ data: {name: 'John', age: 42}}), 'Should match strict match');
    t.ok(matchNameAndAge({ data: {name: 'John', age: 42, state: 'WA'}}), 'Should match with more keys');
    t.notOk(matchNameAndAge({ data: {name: 'John', age: 41}}), 'Should not match when one property does not match');
    t.notOk(matchNameAndAge({ data: {name: 'John'}}), 'Should not match when property is missing');
    t.notOk(matchNameAndAge(), 'Should not match when object is missing');
    t.end();
  });
  t.end();
});
