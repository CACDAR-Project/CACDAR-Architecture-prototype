let Utils = require(process.cwd() + '/tools/utils.js');

module.exports = function (coord, squares, target) {
    let x = coord.x;
    let y = coord.y;

    let distances = [];
    let queue = [];
    queue.push({x: x, y: y, path: [{x: x, y: y}]});

    while (queue.length) {
        let current = queue.shift();

        let square = squares.find(val => Utils.xyEqual(val, current));
        if (targetCheck(square, target)) {
            return current.path;
        }

        distances.push({x: current.x, y: current.y, distance: current.path.length});

        let neighbors = Utils.getAdjacentCoordinates(current);

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

let targetCheck = function(square, target) {
    if (Array.isArray(target)) {
        return target.some(val => Utils.xyEqual(val, square));
    }
    return square.visited === target || square.symbol === target || Utils.xyEqual(square, target);
};