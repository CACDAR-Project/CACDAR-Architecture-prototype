class Agent {

    constructor(configName, environment) {
        this.sensors = [];
        this.actions = [];
        this.sensorInfo = [];
        this.commands = [];
        this.environment = environment;
        this.initWithConfig(configName);
    }

    initWithConfig(configName) {
        let config = require(process.cwd() + '/config/' + configName + ".json");

        if (config===null) {
            console.log("No proper .json config provided!");
            return;
        }

        this.parameters = config.parameters;
        this.initSensors(config.sensors);
        this.initLogic(config.decisionLogic);
        this.initActions(config.actions);
    }

    initSensors(sensorList) {
        for (let sensor of sensorList) {
            let Sensor = require(process.cwd() + '/sensors/' + sensor.name + '.js');
            this.sensors.push(new Sensor(sensor.parameters));
        }
    }

    initLogic(decisionLogic) {
        let Logic = require(process.cwd() + '/decisionLogic/' + decisionLogic + ".js");
        this.decisionLogic = new Logic();
    }

    initActions(actionList) {
        for (let action of actionList) {
           let ActionFunction = require(process.cwd() + '/actions/' + action.name + '.js');
           this.actions.push(ActionFunction);
        }
    }

    act() {
        this.processSensors();
        this.decisionMaking();
        this.performAction();
    }

    processSensors() {
        this.sensorInfo = [];
        for (let sensor of this.sensors) {
            let sensorResponse = sensor.perceive(this.parameters, this.environment);
            this.sensorInfo.push(sensorResponse);
        }
    }

    decisionMaking() {
        let nextCommand = this.decisionLogic.next(this.parameters, this.sensorInfo);
        this.commands.push(nextCommand);
    }

    performAction() {
        let command = this.commands.shift();
        if (command != null) {
           for (let action of this.actions) {
               if (action.name === command.actionName) {
                   action.perform(command.parameters, this.parameters, this.environment);
               }
           }
        }
    }

}

module.exports = Agent;



