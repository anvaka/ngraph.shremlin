module.exports = createEmptyIterator;

var emptyIteratorInstance;

function createEmptyIterator() {
  // it's like a singleton.
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
  return false;
};

EmptyIterator.prototype.current = function () { }
