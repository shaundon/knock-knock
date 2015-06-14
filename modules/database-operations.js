var fs = require('fs');

module.exports = {
	dbFile: __dirname + '/../database.json',
	database: {},
	initialiseDatabase: function() {
		this.database = JSON.parse(fs.readFileSync(this.dbFile));
	},
	saveDatabase: function() {
		fs.writeFile(this.dbFile, JSON.stringify(this.database), function(err) {
			if (err) {
				console.log('Error saving to database.', err);
				return;
			}
			console.log('Database updated.');
		})
	},
	getMetadata: function() {
		return this.database.meta || {};
	},
	getResidences: function() {
		return this.database.residences;
	},
	getResidence: function(id) {
		var that = this;
		for (var i in that.database.residences) {
			var current = that.database.residences[i];
			if (current.id && current.id == id) {
				return current;
			}
		}
		return null;
	},
	createResidence: function(id, name, code) {
		var that = this;
		var residence = {
			id: id,
			name: name,
			code: code
		};
		that.database.residences.push(residence);
		that.saveDatabase();
		return residence;
	},
	updateResidence: function(id, name, code) {
		var that = this;
		for (var i in that.database.residences) {
			if (that.database.residences[i].id == id) {
				that.database.residences[i].name = name;
				that.database.residences[i].code = code;
				that.saveDatabase();
				return that.database.residences[i];
			}
		}
		return null;
	},
	deleteResidence: function(id) {
		var that = this;
		for (var i in that.database.residences) {
			if (that.database.residences[i].id == id) {
				that.database.residences.splice(i, 1);
				that.saveDatabase();
				return true;
			}
		}
		return false;
	},
	addToAuditLog: function(event) {
		var that = this;
		for (var i in that.database.residences) {
			if (that.database.residences[i].id == event.id) {
				var auditLog = that.database.residences[i].auditLog || [];
				auditLog.push({
					text: event.text,
					date: new Date()
				});
				that.database.residences[i].auditLog = auditLog;
				return that.database.residences[i];
			}
		}
		return null;
	} 
};