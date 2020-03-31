class RandomSpawner {

    constructor() {
        let config = require(process.cwd() + "/config/randomspawnconfig.json");

        this.interval = 10;
        if (config.interval) {
            this.interval = config.interval;
        }

        this.simultaneous = 1;
        if (config.simultaneous) {
            this.simultaneous = config.simultaneous;
        }

        this.index = 0;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    spawnTrash(environment) {
        this.index++;
        if (this.index === this.interval) {
            for (let i = 0; i < this.simultaneous; ++i) {
                let coord = environment.freeSquares[this.getRandomInt(environment.freeSquares.length)];
                environment.grid[coord.y][coord.x] = '*';
            }
            this.index = 0;
        }
    }

}

module.exports = RandomSpawner;