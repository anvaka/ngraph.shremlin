/**
 * # Base Pipe
 *
 * Graph traversal operations in Shremlin are achieved by pipes. Pipes accept
 * input data, and emit transformed data. E.g. ```VerticesToVerticesPipe```
 * accepts a vertex as an input and emits adjacent vertices (neighbors). Since
 * each emitted object is also a vertex, it can be used as an input
 * to next `VerticesToVerticesPipe`, forming a _Pipeline_.
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

// Pipe iteration
// --------------

/**
 * `current()` returns current element of collection. If collection is
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

/**
 * This is how we tell current pipe where to read data from.
 *
 * @param {BasePipe} sourcePipe should be an object which implement `moveNext()` and
 *   `current()` methods
 */
BasePipe.prototype.setSourcePipe = function (sourcePipe) {
  var sourcePipeIsValid = sourcePipe &&
    typeof sourcePipe.moveNext === 'function' &&
    typeof sourcePipe.current === 'function';
  if (!sourcePipeIsValid) {
    throw new Error('setSourcePipe received bad pipe');
  }

  this._sourcePipe = sourcePipe;
};

/**
 * When we want other pipe object to read data from `this` pipe we call
 * `this.pipe(other)`
 *
 * @param {BasePipe} destinationPipe should be an object which implements
 * `setSourcePipe` method
 */
BasePipe.prototype.pipe = function (destinationPipe) {
  var destinationPipeIsValid = destinationPipe &&
          typeof destinationPipe.setSourcePipe === 'function';
  if (!destinationPipeIsValid) {
    throw new Error('pipe recieved bad destination pipe');
  }

  destinationPipe.setSourcePipe(this);
  // To get chainable syntax return destinationPipe
  return destinationPipe;
};

/**
 * Pipes will not immediately start iterating over source data, unless
 * we ask them to do so. This allows efficiently delay computation up to the
 * point where it is absolutely necessary. Calling `pipe.forEach` begins data
 * flow.
 *
 * `callback` should be a function which will be called for each element of
 * this pipe.
 *
 * Example:
 * ```
 *   g.V() // creates pipe of graph's vertices
 *     // No iteration will start until we call:
 *    .forEach(function(vertex) {
 *      console.log(v.id); // print all vertices
 *    });
 * ```
 */
BasePipe.prototype.forEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error("Callback is expected to be a function");
  }
  while (this.moveNext()) {
    callback(this.current());
  }

  return this;
};

/*
 * Getting path
 * ------------
 *
 * When traversing a graph it is very important to know where we came from
 * to current node. Each `pipe` object has ability to inspect all chain of
 * pipes through which traversal algorithm went.
 *
 * To do so clients should use a [PathPipe](pipes/pathPipe.html).
 */

/**
 * Build array of `current` objects in the chain of source pipes up to this point.
 * And add `current` object of this pipe to the end of the array
 */
BasePipe.prototype.getCurrentPath = function () {
  var pathToHere = getPathToHere(this._sourcePipe);
  pathToHere.push(this._current);

  return pathToHere;
};

function getPathToHere(basePipe) {
  var hasPath = basePipe && typeof basePipe.getCurrentPath === 'function';
  if (!hasPath) {
    return []; // we are at the start of pipeline
  }

  return basePipe.getCurrentPath();
}
