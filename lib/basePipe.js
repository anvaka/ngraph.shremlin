module.exports = BasePipe;

function BasePipe() {
  this._current = undefined;
  this._starts = undefined;
}

BasePipe.prototype.current = function () {
  return this._current;
};

BasePipe.prototype.moveNext = function () {
  if (this._starts.moveNext()) {
    this._current = this._starts.current();
    return true;
  }
  return false;
};

BasePipe.prototype.setStarts = function (startsIterators) {
  this._starts = startsIterators;
};

BasePipe.prototype.forEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error("Callback is expected to be a function");
  }
  while (this.moveNext()) {
    callback(this.current());
  }
};
