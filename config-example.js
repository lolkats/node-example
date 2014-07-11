module.exports = {
	// Uses winston logger
	log: {
		transports:[
			{
				transport:"File",
				options:{
					filename: "server.log"
				}
			},
			{
				transport:"Console",
				options:{
					colorize:true
				}
			}
		]
	},
	// Uses sequelize
	db: {
		db:"data.db",
		options: {
			dialect:'sqlite',
    		storage:'data.db'
		},
		forceSync:true
	},
	secret:"keyboard cat"
};