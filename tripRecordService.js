let tripRecordCRUDS = require("./tripRecordCRUDS.js");

async function createTripRecord(req, res, next){
	let tripRecord = req.body;

	try{
		let savedTripRecord = await tripRecordCRUDS.createTripRecordHelper(tripRecord);

		res.send({
			message: "tripRecordService.js: createTripRecord:",
			savedTripRecord: savedTripRecord
		});
		res.end();
	}
	catch(err){
		res.send({
			message: "tripRecordService.js: createTripRecord:",
			error: err.toString()
		});
		res.end();		
	}
}

async function getLastTripRecordForRegistrationNumber(req, res, next){
	let registrationNumber = req.query["registrationNumber"];

	try{
		let tripRecord = await tripRecordCRUDS.getLastTripRecordForRegistrationNumberHelper(registrationNumber);

		res.send({
			message: "tripRecordService.js: getLastTripRecordForRegistrationNumber:",
			tripRecord: tripRecord
		});
		res.end();
	}
	catch(err){
		res.send({
			message: "tripRecordService.js: getLastTripRecordForRegistrationNumber:",
			error: err.toString()
		});
		res.end();		
	}
}

module.exports = {
	createTripRecord: createTripRecord,
	getLastTripRecordForRegistrationNumber: getLastTripRecordForRegistrationNumber
};