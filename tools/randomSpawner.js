let Utils = require(process.cwd() + '/tools/utils.js');

class RandomSpawner {

    constructor(config) {

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

    spawnTrash(environment) {
        this.index++;
        if (this.index === this.interval) {
            for (let i = 0; i < this.simultaneous; ++i) {
                let coord = environment.freeSquares[Utils.getRandomInt(environment.freeSquares.length)];
                if (environment.grid[coord.y][coord.x] === '.'){
                    environment.grid[coord.y][coord.x] = '*';
                }
            }
            this.index = 0;
        }
    }

}

module.exports = RandomSpawner;