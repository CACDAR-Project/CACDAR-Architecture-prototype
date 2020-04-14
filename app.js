let environment = {agents: [], grid: [], freeSquares: []};

// Initialize from config
let simConfig = require(process.cwd() + '/config/simulation.json');

// Read the map file, get whole grid of tiles + separate list of free tiles (for use in functions)
let MapReader = require(process.cwd() + '/tools/mapReader.js');
let maps = simConfig.environment.mapFiles;

// Initialize agents
let Agent = require(process.cwd() + '/agent/agent.js');
for (let agent of simConfig.agents) {

    let obj = require(process.cwd() + '/config/' + agent.config + ".json");

    // Used to deep copy the object, otherwise all agents created from the same config file share the same reference (!!)
    let config = JSON.parse(JSON.stringify(obj));

    config.id = agent.id;
    config.parameters.coordinates = {x: agent.x, y: agent.y};

    environment.agents.push(new Agent(config, environment));
}

// Initialize visualization
let Visualization = require(process.cwd() + '/tools/visualization.js');
let GUI = new Visualization;

// Initialize random garbage spawner
let RandomSpawner = require(process.cwd() + '/tools/randomSpawner.js');
let spawner = new RandomSpawner(simConfig.environment.spawnConfig);


let loopCondition = function() {
    return (!environment.nextMap);
}

// Call this to proceed
let next = function() {
    spawner.spawnTrash(environment);
    for (let agent of environment.agents) {
        agent.act();
    }
    GUI.visualize(environment);
};

while (maps.length) {
    // Read the map file, get whole grid of tiles + separate list of free tiles (for use in functions)
    let mapFile = maps.shift();
    let reader = new MapReader(mapFile);
    let grid = reader.grid;
    let freeSquares = reader.freeSquaresToList();
    environment.grid = grid;
    environment.freeSquares = freeSquares;
    environment.nextMap = false;

    for (let agent of environment.agents) {
        agent.resetConfigParameters();
    }

    // Visualize initial state
    GUI.resetSteps();
    GUI.visualize(environment);

    // Infinite loop for now, use with debug
    while (loopCondition()) {
        next();
    }
}
