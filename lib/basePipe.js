/**
 * # Base Pipe
 *
 * Graph traversal operations in Shremlin are achieved by pipes. Pipes accept
 * input data, and emit transformed data. E.g. ```VerticesToVerticesPipe```
 * accepts a vertex as an input and emits adjacent vertices (neighbors). Since
 * each emitted object is also a vertex, it can be used as an input
 * to next `VerticesToVerticesPipe`
 *
 * `BasePipe` serves as an abstract base class for all pipes in Shremlin
 *
 * _NB:_ If you are familiar with concept of [Enumerators](http://msdn.microsoft.com/en-us/library/78dfe2yb.aspx)
 * in .NET this should be familiar. Like `Enumerators` Pipes have `current()`
 * and `moveNext()` methods. On top of this Pipes are chained into each other
 * thus one pipe serves as a data source to another
 */
module.exports = BasePipe;

function BasePipe() {
  this._current = undefined;
  this._sourcePipe = undefined;
}

/**
 * `current()` should return current element of collection. If collection is
 * empty, then undefined value is returned.
 */
BasePipe.prototype.current = function () {
  return this._current;
};

/**
 * `moveNext()` tries to move `current` element to next position. If
 * moved successfuly this method returns true. Otherwise false
 */
BasePipe.prototype.moveNext = function () {
  if (this._moveNext()) {
    this._current = this.current();
    return true;
  }

  return false;
};

/**
 * Each child of `BasePipe` should provide concrete implementation
 * of `_moveNext`.
 */
BasePipe.prototype._moveNext = function (startsIterators) {
  throw new Error('This method should be implemented by children');
};

// TODO: continue from here. Taking a break before moving on
BasePipe.prototype.setSourcePipe = function (sourcePipe) {
  // todo: validate iterator
  this._sourcePipe = sourcePipe;
};

BasePipe.prototype.getCurrentPath = function () {
  var pathToHere = getPathToHere(this._sourcePipe);
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
  dst.setSourcePipe(this);
  return dst;
};


function getPathToHere(basePipe) {
  var hasPath = basePipe && typeof basePipe.getCurrentPath === 'function';
  if (!hasPath) {
    return []; // we are at the start of pipeline
  }

  return basePipe.getCurrentPath();
}
