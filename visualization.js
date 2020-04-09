class Visualization {

    constructor() {
        this.step = 0;
    }

    // Print map with robots marked on it (number of robots on the same square)
    visualize(environment) {
        let map = environment.grid;

        let coords = [];
        for (let robo of environment.agents) {
            coords.push(robo.parameters.coordinates);
        }

        let width = map[0].length;
        let height = map.length;

        console.log("Step " + this.step);
        this.step++;

        let rows = "";

        for (let y = 0; y < height; ++y) {
            let row = "";
            for (let x = 0; x < width; ++x) {
                let square = map[y][x];
                let overlap = 0;

                for (let i = 0; i<coords.length; ++i) {
                    if (x === coords[i].x && y === coords[i].y) {
                        overlap += i + 1;
                    }
                }

                if (overlap) {
                    row += overlap;
                } else {
                    row += square;
                }
            }
            rows += row + "\n";
        }
        console.log(rows);
    };
}

module.exports = Visualization;