let Utils = require(process.cwd() + '/utils.js');

module.exports = function (coord, squares, target) {
    let x = coord.x;
    let y = coord.y;

    let distances = [];
    let queue = [];
    queue.push({x: x, y: y, path: [{x: x, y: y}]});

    while (queue.length) {
        let current = queue.shift();

        let square = squares.find(val => Utils.xyEqual(val, current));
        if ((square.visited === target) || square.symbol === target) {
            return current.path;
        }

        distances.push({x: current.x, y: current.y, distance: current.path.length});

        let neighbors = [{x: current.x, y: current.y + 1}, {x: current.x + 1, y: current.y},
            {x: current.x - 1, y: current.y}, {x: current.x, y: current.y - 1}];

        for (let nb of neighbors) {
            if (!distances.some(val => Utils.xyEqual(val, nb)) &&
                    squares.some(val => Utils.xyEqual(val, nb))) {
                let newPath = current.path.concat();
                newPath.push(nb);
                queue.push({x: nb.x, y: nb.y, path: newPath});
            }
        }
    }
    return [];
};