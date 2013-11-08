/**
 * # Base Pipe
 *
 * Graph traversal operations in Shremlin are achieved by pipes. Pipes accept
 * input data, and emit transformed data. E.g. ```VerticesToVerticesPipe```
 * accepts a vertex as an input and emits adjacent vertices (neighbors). Since
 * each of emitted objects are also vertices, they can also serve as an input
 * to ```VerticesToVerticesPipe```
 *
 * ```BasePipe``` serves as an abstract base class for all pipes in Shremlin
 *
 */
module.exports = BasePipe;

function BasePipe() {
  this._current = undefined;
  this._starts = undefined;
}

/**
 * If you are familiar with concept of Enumerable objects in .NET
 * this should be familiar. ```current()``` should return
 * current element of collection. If collection is empty, and you call
 * ```current()``` method - undefined value is returned.
 */
BasePipe.prototype.current = function () {
  return this._current;
};

/**
 * `moveNext()` tries to move `current` element to next position. If
 * moved successfuly this method returns true. Otherwise false
 */
BasePipe.prototype.moveNext = function () {
  // Each child of `BasePipe` should provide concrete implementation
  // of `_moveNext`.
  if (this._moveNext()) {
    this._current = this.current();
    return true;
  }
  return false;
};

BasePipe.prototype._moveNext = function (startsIterators) {
  throw new Error('This method should be implemented by children');
};

// TODO: continue from here. Taking a break before moving on
BasePipe.prototype.setStarts = function (startsIterators) {
  // todo: validate iterator
  this._starts = startsIterators;
};

BasePipe.prototype.getCurrentPath = function () {
  var pathToHere = getPathToHere(this._starts);
  pathToHere.push(this._current);

  return pathToHere;
};

BasePipe.prototype.forEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error("Callback is expected to be a function");
  }
  while (this.moveNext()) {
    callback(this.current());
  }

  return this;
};

BasePipe.prototype.pipe = function (dst) {
  dst.setStarts(this);
  return dst;
};


function getPathToHere(basePipe) {
  var hasPath = basePipe && typeof basePipe.getCurrentPath === 'function';
  if (!hasPath) {
    return []; // we are at the start of pipeline
  }

  return basePipe.getCurrentPath();
}
