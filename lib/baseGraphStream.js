module.exports = BaseGraphStream;

function BaseGraphStream() {
}

BaseGraphStream.prototype._getPathToHere = function () {
  if (this._starts && typeof this._starts.getCurrentPath === 'function') {
    return this._starts.getCurrentPath();
  } else {
    return [];
  }
};

BaseGraphStream.prototype.getCurrentPath = function () {
  var pathElements = this._getPathToHere();
  if (this._currentEnd !== undefined) {
    pathElements.push(this._currentEnd);
  }
  return pathElements;
}
