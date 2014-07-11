var Sequelize  = require('sequelize');
module.exports = function(conf){
	var adapter = new Sequelize(conf.db, conf.user, conf.pass, conf.options);
	adapter
		.authenticate()
		.complete(function(err) {
			if (!!err) {
				Log.error('Unable to connect to the database:', err);
			} else {
				Log.info('Connection to database has been established successfully.');
			}
	});
	adapter
		.sync({ force: conf.forceSync })
		.complete(function(err) {
		if (!!err) {
			Log.error('An error occurred while creating the table:', err);
		} else {
			Log.info('Database synced.');
		}
	});
};