class MapReader {

    constructor(mapName) {
        let map = this.readMapFile("/config/maps/" + mapName);
        this.grid = [];

        for (let row of map) {
            let gridRow = [];
            for (let char of row.trim()) {
                gridRow.push(char + '');
            }
            this.grid.push(gridRow);
        }
    }

    readMapFile(mapName) {
        const fs = require('fs');
        const filepath = process.cwd() + "/" + mapName;
        return fs.readFileSync(filepath, 'utf8').split('\n');
    }

    // Get the list of "free" squares (squares agents can move on)
    freeSquaresToList() {
        let freeSquares = [];
        let x = 0;
        let y = 0;

        for (let row of this.grid) {
            for (let square of row) {
                if (this.grid[y][x] !== '#') {
                    freeSquares.push({x: x, y: y});
                }
                x++;
            }
            x = 0;
            y++;
        }

        return freeSquares;
    }

}

module.exports = MapReader;
