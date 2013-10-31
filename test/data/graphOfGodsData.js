// A test graph from gremlin:
// https://raw.github.com/wiki/thinkaurelius/titan/images/graph-of-the-gods-2.png

module.exports = createGraphOfGods;

function createGraphOfGods() {
  var graph = require('ngraph.graph')();

  graph.addNode('hercules', { age: 30, type: 'demigod'});
  graph.addNode('jupiter', { age: 5000, type: 'god'});
  graph.addNode('alcmene', { age: 45, type: 'human'});
  graph.addNode('saturn', { age: 10000, type: 'titan'});
  graph.addNode('pluto', { age: 4000, type: 'god'});
  graph.addNode('neptune', { age: 4500, type: 'god'});

  graph.addNode('nemean', { type: 'monster'});
  graph.addNode('hydra', { type: 'monster'});
  graph.addNode('cerberus', { type: 'monster'});

  graph.addNode('sky', { type: 'location'});
  graph.addNode('sea', { type: 'location'});
  graph.addNode('tartarus', { type: 'location'});

  // done with nodes, add edges:
  graph.addLink('hercules', 'nemean', {
    action: 'battled',
    times: 1,
    place: [38.1, 23.7]
  });
  graph.addLink('hercules', 'hydra', {
    action: 'battled',
    times: 2,
    place: [37.7, 23.9]
  });
  graph.addLink('hercules', 'cerberus', {
    action: 'battled',
    times: 12,
    place: [39, 22]
  });
  graph.addLink('hercules', 'alcmene', 'mother');
  graph.addLink('hercules', 'jupiter', 'father');

  graph.addLink('cerberus', 'tartarus', { action: 'lives' });
  graph.addLink('pluto', 'tartarus', {
   action: 'lives',
   reason: 'no fear of death'
  });
  graph.addLink('pluto', 'jupiter', 'brother');
  graph.addLink('jupiter', 'pluto', 'brother');

  graph.addLink('pluto', 'neptune', 'brother');
  graph.addLink('neptune', 'pluto', 'brother');

  graph.addLink('jupiter', 'neptune', 'brother');
  graph.addLink('neptune', 'jupiter', 'brother');

  graph.addLink('jupiter', 'saturn', 'father');
  graph.addLink('jupiter', 'sky', {
    action: 'lives',
    reason: 'loves fresh breezes'
  });

  graph.addLink('neptune', 'sea', {
    action: 'lives',
    reason: 'loves waves'
  });

  return graph;
}
