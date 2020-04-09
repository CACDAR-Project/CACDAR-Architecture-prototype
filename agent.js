class Agent {

    constructor(config, environment) {
        this.sensors = [];
        this.actions = [];
        this.fallback = null;
        this.sensorInfo = [];
        this.commands = [];
        this.environment = environment;
        this.initWithConfig(config);
    }

    initWithConfig(config) {
        this.parameters = config.parameters;
        this.parameters.id = config.id;
        this.parameters.messages = [];
        this.actionList = config.actions;
        this.initSensors(config.sensors);
        this.initLogic(config.decisionLogic);
        this.initActions(config.actions);
        this.initFallback(config.fallback);
    }

    initSensors(sensorList) {
        for (let sensor of sensorList) {
            let Sensor = require(process.cwd() + '/sensors/' + sensor.name + '.js');
            this.sensors.push(new Sensor(sensor.parameters));
        }
    }

    initLogic(decisionLogic) {
        let Logic = require(process.cwd() + '/decisionLogic/baseLogic.js');
        this.decisionLogic = new Logic(decisionLogic);
    }

    initActions(actionList) {
        for (let action of actionList) {
           let ActionFunction = require(process.cwd() + '/actions/' + action.name + '.js');
           this.actions.push(ActionFunction);
        }
    }

    initFallback(fallback) {
        if (fallback) {
            let FallbackFunction = require(process.cwd() + '/actions/' + fallback.name + ".js");
            this.fallback = FallbackFunction;
        }
    }

    act() {
        this.processSensors();
        this.decisionMaking();
        this.performActions();
    }

    processSensors() {
        this.sensorInfo = [];
        for (let sensor of this.sensors) {
            let sensorResponse = sensor.perceive(this.parameters, this.environment);
            this.sensorInfo = this.sensorInfo.concat(sensorResponse);
        }
    }

    decisionMaking() {
        this.commands = this.decisionLogic.nextStep(this.parameters, this.sensorInfo, this.actionList);
    }

    performActions() {
        if (this.commands) {
            let command = this.commands.shift();
            while (command) {
                this.processCommand(command);
                command = this.commands.shift();
            }
        }
    }

    processCommand(command) {
        for (let action of this.actions) {
            if (action.name === command.actionName) {
                if (command.isHelpRequest) {
                   this.processHelpRequest(command, action);
                } else {
                    action.perform(command, this.parameters, this.environment);
                }
                return;
            }
        }
        // Fallback for when the agent doesn't have the action
        if (this.fallback) {
            this.fallback.perform(command, this.parameters, this.environment);
        }
    }

    // Do the requested action for any requesting agents in the same square
    processHelpRequest(command, action) {
        for (let agent of this.environment.agents) {
            if (agent.parameters.pendingHelpRequest &&
                    agent.parameters.pendingHelpRequest.actionName === action.name) {
                action.perform(command, agent.parameters, this.environment);
                agent.parameters.pendingHelpRequest = null;
                return;
            }
        }
    }

}

module.exports = Agent;



