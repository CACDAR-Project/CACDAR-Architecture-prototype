class MessageReceiver {

    constructor(parameters) {
    }

    perceive(agentParams, environment) {
        let info = [{name: "messages", content: agentParams.messages.concat()}];
        agentParams.messages = [];
        return info;
    }
}

module.exports = MessageReceiver;