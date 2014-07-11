var winston = require('winston');
var os = require('os');
module.exports = function(conf){
	var log = function(){
	}
	var transports = [];
	conf.transports.forEach(function(transport){
		if(typeof transport.transport === "string"){
			transports.push(new winston.transports[transport.transport](transport.options));
		}
		else{
			transports.push(new transport)(transport.options);
		}
	});
	var Logger = new winston.Logger({
		transports:transports
	});
	// Add metadata
	Logger.log = function(){
		var args = arguments;
		if(!args[2]) args[2] = {};
		args[2].hostname = os.hostname();
		args[2].pid = process.pid;
		winston.Logger.prototype.log.apply(this,[args[0],args[1],args[2]]);
	};

	return Logger; 
};