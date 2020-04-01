module.exports.xyEqual = function(a, b) {
    return a.x === b.x && a.y === b.y;
};

module.exports.listContainsList = function(a, b) {
    return b.every(val => a.some(val2 => this.xyEqual(val, val2)));
};

module.exports.compareDistance = function(a, b) {
    return a.distance - b.distance;
};
