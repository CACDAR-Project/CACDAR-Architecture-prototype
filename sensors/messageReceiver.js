class MessageReceiver {

    constructor(parameters) {
    }

    perceive(agentParams, environment) {
        return {name: "messages", content: environment.messages};
    }
}

module.exports = MessageReceiver;