class Visualization {

    constructor() {
        this.step = 0;
    }

    resetSteps() {
        this.step = 0;
    }

    // Print map with robots marked on it (number of robots on the same square)
    visualize(environment, allMessages) {
        let map = environment.grid;

        let coords = [];
        for (let robo of environment.agents) {
            coords.push(robo.parameters.coordinates);
        }

        for (let agent of allMessages) {
            console.log("Agent " + agent.id + " messages: " + JSON.stringify(agent.messages));
        }

        let width = map[0].length;
        let height = map.length;

        console.log("\nStep " + this.step);
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