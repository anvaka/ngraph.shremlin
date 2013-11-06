module.exports = BasePipe;

function BasePipe() {
  this._current = undefined;
  this._starts = undefined;
}

BasePipe.prototype.current = function () {
  return this._current;
};

BasePipe.prototype.moveNext = function () {
  if (this._moveNext()) {
    this._current = this.current();
    return true;
  }
  return false;
};

BasePipe.prototype.setStarts = function (startsIterators) {
  // todo: validate iterator
  this._starts = startsIterators;
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

BasePipe.prototype._moveNext = function (startsIterators) {
  throw new Error('This method should be implemented by children');
};