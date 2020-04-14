let Utils = require(process.cwd() + '/tools/utils.js');

// Finds the shortest path through ALL nodes from the current node, don't try this at home
module.exports = function (coord, squares) {
    let x = coord.x;
    let y = coord.y;

    let queue = [];
    queue.push({x: x, y: y, path: [{x: x, y: y}]});

    while (queue.length) {
        let current = queue.shift();

        if (current.path.length >= squares.length) {
            if (Utils.listContainsList(current.path, squares)) {
                return current.path;
            }
        }

        let neighbors = Utils.getAdjacentCoordinates(current);
        let alreadyVisited = [];
        let deadEnd = true;

        for (let nb of neighbors) {
            if (!current.path.some(val => Utils.xyEqual(val, nb)) &&
                squares.some(val => Utils.xyEqual(val, nb))) {
                let newPath = current.path.concat();
                newPath.push(nb);
                queue.push({x: nb.x, y: nb.y, path: newPath});
                deadEnd = false;
            } else if (squares.some(val => Utils.xyEqual(val, nb))) {
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
};

