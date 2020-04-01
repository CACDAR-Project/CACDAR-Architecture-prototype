let environment = {agents: [], grid: [], freeSquares: [], messages: []};

// Read the map file, get whole grid of tiles + separate list of free tiles (for use in functions)
let MapReader = require(process.cwd() + '/mapReader');
let reader = new MapReader("areamap2");
let grid = reader.grid;
let freeSquares = reader.freeSquaresToList();
environment.grid = grid;
environment.freeSquares = freeSquares;

// Initialize the robots
let Agent = require(process.cwd() + '/agent.js');
let robo1 = new Agent('roboconfig', environment);
let robo2 = new Agent('roboconfig2', environment);
environment.agents = [robo1, robo2];

// Initialize visualization
let Visualization = require(process.cwd() + '/visualization.js');
let GUI = new Visualization;

// Initialize random garbage spawner
let RandomSpawner = require(process.cwd() + '/randomSpawner.js');
let spawner = new RandomSpawner();

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

