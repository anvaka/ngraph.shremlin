var VerticesToVerticesStream = require('./verticesToVerticesStream');

module.exports = function (targetStreamPrototype) {
  targetStreamPrototype.out = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'out'));
  };

  targetStreamPrototype.in = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'in'));
  };

  targetStreamPrototype.both = function () {
    return this.pipe(new VerticesToVerticesStream(this._graph, 'both'));
  };
}
