let Utils = require(process.cwd() + '/utils.js');

// Logic class example, probably has to be split to more files
class Logic {

    constructor() {
        this.remainingPath = [];
    }

    // Calculate a new path, or get the next node if one already exists
    next(agentParams, sensorInfo) {
        let freeSquares = [];

        for (let info of sensorInfo) {
            if (info.name === "garbageSpotted") {
                if (!agentParams.maxGarbage || (agentParams.maxGarbage &&
                        agentParams.garbageHeld >= agentParams.maxGarbage)) {
                    return {actionName: "collectGarbage"};
                }
            }
            if (info.name === "mapInformation") {
                freeSquares = info.content.freeSquares;
            }
        }

        if (this.remainingPath.length === 0 && freeSquares!=null) {
            let pathFound = this.findPath(agentParams.coordinates, freeSquares);
            if (pathFound) {
                this.remainingPath = pathFound;
                this.remainingPath.shift();
            }
        }

        let next = this.remainingPath.shift();
        if (next) {
            return {actionName: "move", parameters: {x: next.x, y: next.y}};
        }

        return [];
    };

    // Finds the shortest path through ALL nodes from the current node, don't try this at home
    findPath(coord, freeSquares) {
        let x = coord.x;
        let y = coord.y;

        let queue = [];
        queue.push({x: x, y: y, path: [{x: x, y: y}]});

        while (queue.length) {
            let current = queue.shift();

            if (current.path.length >= freeSquares.length) {
                if (Utils.listContainsList(current.path, freeSquares)) {
                    return current.path;
                }
            }

            let neighbors = [{x: current.x, y: current.y + 1}, {x: current.x + 1, y: current.y},
                {x: current.x - 1, y: current.y}, {x: current.x, y: current.y - 1}];
            let alreadyVisited = [];
            let deadEnd = true;

            for (let nb of neighbors) {
                if (!current.path.some(val => Utils.xyEqual(val, nb)) &&
                    freeSquares.some(val => Utils.xyEqual(val, nb))) {
                    let newPath = current.path.concat();
                    newPath.push(nb);
                    queue.push({x: nb.x, y: nb.y, path: newPath});
                    deadEnd = false;
                } else if (freeSquares.some(val => Utils.xyEqual(val, nb))) {
                    alreadyVisited.push(nb);
                }
            }
            if (deadEnd) {
                for (let nb of alreadyVisited) {
                    let newPath = current.path.concat();
                    newPath.push(nb);
                    queue.push({x: nb.x, y: nb.y, path: newPath});
                }
            }
        }
        return [];
    }
}

module.exports = Logic;
