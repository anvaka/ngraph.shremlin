module.exports = createFilter;

function createFilter(filterExpression) {
  if (typeof filterExpression === undefined) {
    throw new Error('Filter expression should be defined');
  }

  if (isSimpleType(filterExpression)) {
    return simpleTypeFilter(filterExpression);
  } else if (isCustomPredicate(filterExpression)) {
    return customPredicateFilter(filterExpression);
  }
}

function isCustomPredicate (obj) {
  return typeof obj === 'function';
}

function isSimpleType(obj) {
  return !!((typeof obj).match(/number|string|boolean/) || (obj === null));
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
