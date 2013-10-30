module.exports = createFilter;

function createFilter(filterExpression) {
  if (typeof filterExpression === undefined) {
    throw new Error('Filter expression should be defined');
  }

  if (isSimpleType(filterExpression)) {
    return simpleTypeFilter(filterExpression);
  } else if (isCustomPredicate(filterExpression)) {
    return customPredicateFilter(filterExpression);
  } else if (isArray(filterExpression)) {
    return arrayFilter(filterExpression);
  }
  // at this point only object type is possible:
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
