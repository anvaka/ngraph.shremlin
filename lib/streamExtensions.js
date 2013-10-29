var VerticesToVerticesStream = require('./verticesToVerticesStream');

module.exports = function (sourceStreamPrototype) {
  sourceStreamPrototype.out = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'out'));
  };

  sourceStreamPrototype.in = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'in'));
  };

  sourceStreamPrototype.both = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'both'));
  };
}
