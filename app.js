let environment = {agents: [], grid: [], freeSquares: []};

// Initialize with config
let simConfig = require(process.cwd() + '/config/simulation.json');

// Read the map file, get whole grid of tiles + separate list of free tiles (for use in functions)
let MapReader = require(process.cwd() + '/mapReader');
let reader = new MapReader(simConfig.environment.mapFile);
let grid = reader.grid;
let freeSquares = reader.freeSquaresToList();
environment.grid = grid;
environment.freeSquares = freeSquares;

// Initialize agents
let Agent = require(process.cwd() + '/agent.js');
for (let agent of simConfig.agents) {

    let obj = require(process.cwd() + '/config/' + agent.config + ".json");

    // Used to deep copy the object, otherwise all agents created from the same config file share the same reference (!!)
    let config = JSON.parse(JSON.stringify(obj));

    config.id = agent.id;
    config.parameters.coordinates = {x: agent.x, y: agent.y};

    environment.agents.push(new Agent(config, environment));
}

// Initialize visualization
let Visualization = require(process.cwd() + '/visualization.js');
let GUI = new Visualization;

// Initialize random garbage spawner
let RandomSpawner = require(process.cwd() + '/randomSpawner.js');
let spawner = new RandomSpawner(simConfig.environment.spawnConfig);

// Visualize initial state
GUI.visualize(environment);

// Call this to proceed
let next = function() {
    spawner.spawnTrash(environment);
    for (let agent of environment.agents) {
        agent.act();
    }
    GUI.visualize(environment);
};

// Infinite loop for now, use with debug
let active = true;
while (active) {
    next();
}
