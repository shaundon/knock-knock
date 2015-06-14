// Local modules.
var databaseOps = require('./modules/database-operations.js');
var utils = require('./modules/utils.js');

// Our database.
databaseOps.initialiseDatabase();

// Modules from NPM.
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

app.use('/', express.static('public'));

app.set('port', (process.env.PORT || 5000));

var AUDIT_TYPES = {
	success: 'Successful login.',
	fail: 'Failed login.',
	created: 'Residence created.',
	changed: 'Residence updated.'
};

app.listen(app.get('port'), function() {
	console.log('Server running on port ' + app.get('port'));
});

/*
REST API endpoints.
*/

// Get all residences.
app.get('/residence', function(req, res) {
	console.log('GET request to /residence.');
	res.status(200).send(databaseOps.getResidences());
});

// Get a single residence.
app.get('/residence/:id', function(req, res) {
	console.log('GET request to /residence/:id.');
	var id = req.params.id;
	var residence = databaseOps.getResidence(id);
	if (residence) {
		res.status(200).send(residence);
	}
	else {
		res.status(404).send('No residence found for ID "' + id + '"');
	}
});

// Create a residence.
app.post('/residence', function(req, res) {
	console.log('POST request to /residence/.');
	var name = req.body.name || '';

	if (!name) {
		res.status(400).send("Parameter missing: name");
		return;
	}

	var id = utils.generateUniqueId();
	console.log(id);
	var code = utils.generateAccessCode(databaseOps.getMetadata().codeLength);

	var residence = databaseOps.createResidence(id, name, code);

	databaseOps.addToAuditLog({
		id: id,
		text: AUDIT_TYPES.created
	});

	res.status(201).send(residence);
});

// Update a residence.
app.put('/residence/:id', function(req, res) {
	console.log('PUT request to /residence/:id.');
	var id = req.params.id;

	var name = req.body.name || '';
	var code = req.body.code || '';

	if (!name) {
		res.status(400).send('Parameter missing: name');
		return;
	}
	if (!code) {
		res.status(400).send('Parameter missing: code');
	}
	if (!utils.validateCode(code, databaseOps.getMetadata().codeLength, databaseOps.getMetadata().acceptableChars)) {
		res.status(400).send('Code must be ' + databaseOps.getMetadata().codeLength + ' digits, 0-9.');
	}

	var residence = databaseOps.updateResidence(id, name, code);

	if (residence) {
		databaseOps.addToAuditLog({
			id: id,
			text: AUDIT_TYPES.changed
		});
		res.status(200).send(residence);
	}
	else {
		res.status(400).send('No residence found with ID "' + id + '"');
	}
});

// Delete a residence.
app.delete('/residence/:id', function(req, res) {
	console.log('DELETE request to /residence/:id.');
	var id = req.params.id;

	var deleted = databaseOps.deleteResidence(id);
	if (deleted) {
		res.status(204).send("");
	}
	else {
		res.status(404).send('No residence found with ID "' + id + '"');
	}
});

/* Entry attempt endpoints. */

app.put('/authenticate/:id', function(req, res) {
	console.log("PUT request to /authenticate/:id");
	var id = req.params.id;
	var residence = databaseOps.getResidence(id);
	if (!residence) {
		console.log("No residence found with ID " + id);
		res.status(404).send('No residence found with ID "' + id + '"');
		return;
	}

	var attemptedCode = req.body.code || '';
	if (!attemptedCode) {
		console.log("No code supplied");
		databaseOps.addToAuditLog({
			id: id,
			text: AUDIT_TYPES.fail
		});
		res.status(400).send("No code supplied.");
		return;
	}

	var realCode = residence.code;

	if (attemptedCode === realCode) {
		console.log("Code was correct!");
		databaseOps.addToAuditLog({
			id: id,
			text: AUDIT_TYPES.success
		});
		res.status(200).send("Come on in!");
	}
	else {
		console.log("Code incorrect. (" + attemptedCode + ")");
		databaseOps.addToAuditLog({
			id: id,
			text: AUDIT_TYPES.fail
		});
		res.status(403).send("Incorrect code.");
	}
});