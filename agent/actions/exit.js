module.exports.name = "exit";

module.exports.perform = function(command, agentParams, environment) {
    agentParams.exit = false;
    environment.nextMap = true;
};