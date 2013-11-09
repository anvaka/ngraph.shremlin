/**
 * # Filtering Pipes
 *
 * Each step of the Pipeline can be filtered. For example when we need to visit
 * vertices connected by outgoing edge, where edge's data satisfies certain
 * rules, filters can be used.
 *
 * Most of the [Syntactic Sugar](../pipeSugar.html) extensions support filters:
 *
 * ```
 *   g.V() // get all nodes
 *    // visit vertices via outgoing edges with data === 42:
 *    .out(42)
 *    // visit vertices via incoming edges with
 *    // data.action === 'battled'
 *    .in({ action: 'battled'})
 *    // and so on
 * ```
 */
module.exports = createFilter;

/**
 * This method creates custom filter predicate based on `filterExpression`
 * value.
 *
 * When `filterExpression` is a simple type (Number, String or Boolean), then
 * returned predicat compares `data` property directly with that value:
 *
 * ```
 *   var match42 = createFilter(42);
 *   // this will print true:
 *   console.log(match42({data: 42}));
 * ```
 *
 * You might be wondering why it compares against `data` property, not object
 * directly (`match42(42)`)? It is thank to the fact, that each vertex or
 * edge of [VivaGraph](https://github.com/anvaka/VivaGraphJS)/[ngraph](https://github.com/anvaka/ngraph.graph)
 * is stored within `xxx.data` property.
 *
 * If you want to filter against direct object attributes, you can pass custom
 * `filterExpression` as a `function`:
 *
 * ```
 *   var match42 = createFiliter(function (obj) {
 *     return obj === 42;
 *   });
 *   // Now this will print true:
 *   console.log(match42(42));
 * ```
 *
 * When `filterExpression` is an array, then `data` property should also be
 * an array (or array-like) object, with the same elements:
 *
 * ```
 *  var matchArray = createFilter([40, 2]);
 *  // prints true:
 *  console.log(matchArray({ data: [40, 2] });
 * ```
 *
 * Finally you can pass `filterExpression` as an `object`, in which case
 * `data` attribute should have all properties of `filterExpression`
 * and they all should be equal to values of your `filterExpression`:
 *
 * ```
 *   var matchJohnSmith = createFilter({
 *     firstName: 'John',
 *     lastName: 'Smith'
 *   });
 *
 *   // true:
 *   matchJohnSmith({
 *     data: { firstName: 'John', lastName: 'Smith' }
 *   });
 *
 *   // false (missing lastName):
 *   matchJohnSmith({
 *     data: { firstName: 'John' }
 *   });
 * ```
 */
function createFilter(filterExpression) {
  if (typeof filterExpression === 'undefined') {
    throw new Error('Filter expression should be defined');
  }

  if (isSimpleType(filterExpression)) {
    return simpleTypeFilter(filterExpression);
  } else if (isCustomPredicate(filterExpression)) {
    return customPredicateFilter(filterExpression);
  } else if (isArray(filterExpression)) {
    return arrayFilter(filterExpression);
  }

  return customObjectFilter(filterExpression);
}

function isCustomPredicate (obj) {
  return typeof obj === 'function';
}

function isSimpleType(obj) {
  return !!((typeof obj).match(/number|string|boolean/) || (obj === null));
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function simpleTypeFilter(value) {
  return function (object) {
    return object && object.data === value;
  };
}

function customPredicateFilter(predicate) {
  return function (object) {
    return predicate(object);
  };
}

function arrayFilter(array) {
  return function (object) {
    if (object && object.data && object.data.length) {
      if (object.data.length !== array.length) {
        return false;
      }
      for (var i = 0; i < object.data.length; ++i) {
        if (object.data[i] !== array[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

function customObjectFilter(filter) {
  var propertiesToMatch = [];
  for (var key in filter) {
    if (filter.hasOwnProperty(key)) {
      propertiesToMatch.push(key);
    }
  }

  return function (obj) {
    if (!obj || !obj.data) {
      return false;
    }

    for (var i = 0; i < propertiesToMatch.length; ++i) {
      var key = propertiesToMatch[i];
      if (obj.data[key] !== filter[key]) {
        return false;
      }
    }

    return true;
  };
}
