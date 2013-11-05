module.exports = {
  prepare: prepareToPathTracking,
};

function prepareToPathTracking(dst) {
  dst.getCurrentPath = getCurrentPath;
  dst._getPathToHere = getPathToHere;
  dst._trackPath = trackPath;

  dst._currentEnd = undefined;
  dst._starts = undefined;

  dst.on('pipe', function(src) {
    if (dst._starts) {
      throw new Error("Graph streams allows only one source");
    }
    dst._starts = src;
  });
}

function getPathToHere() {
  if (this._starts && typeof this._starts.getCurrentPath === 'function') {
    return this._starts.getCurrentPath();
  } else {
    return [];
  }
};

function getCurrentPath() {
  var pathElements = this._getPathToHere();
  if (this._currentEnd !== undefined) {
    pathElements.push(this._currentEnd);
  }
  return pathElements;
}

function trackPath(obj) {
  // this will only work under assumption streams are synchronously processing
  // each push() operation down in the pipeline. Which might be not accurate
  // representation of streams in node.js.
  this._currentEnd = obj;
}

