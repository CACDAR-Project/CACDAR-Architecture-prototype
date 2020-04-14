class MessageReceiver {

    constructor(parameters) {
    }

    // Empty the messages after receiving
    perceive(agentParams, environment) {
        let msgs = agentParams.messages.concat();
        agentParams.messages = [];
        return msgs;
    }
}

module.exports = MessageReceiver;