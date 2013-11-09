/**
 * # Empty Iterator
 *
 * This iterator represents empty collection. Main purpose of this iterator
 * is to provide [NullObject](http://en.wikipedia.org/wiki/Null_Object_pattern)
 * for pipes, which are not yet initialized with valid iterators.
 *
 * Example:
 * ```
 *   var iterator = createEmptyIterator();
 *   while (iterator.moveNext()) {
 *     console.log('This will never be shown');
 *   }
 * ```
 */
module.exports = createEmptyIterator;

var emptyIteratorInstance;

function createEmptyIterator() {
  // It acts like a singleton
  if (!emptyIteratorInstance) {
    emptyIteratorInstance = new EmptyIterator();
  }
  return emptyIteratorInstance
}

function EmptyIterator() {
  if (!(this instanceof EmptyIterator)) {
    return new EmptyIterator();
  }
}

EmptyIterator.prototype.moveNext = function () {
  // It does not have items
  return false;
};

EmptyIterator.prototype.current = function () { }
