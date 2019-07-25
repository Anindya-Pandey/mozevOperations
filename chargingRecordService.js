let chargingRecordCRUDS = require("./chargingRecordCRUDS.js");

async function createChargingRecord(req, res, next){
	let chargingRecord = req.body;

	try{
		let savedChargingRecord = await chargingRecordCRUDS.createChargingRecordHelper(chargingRecord);

		res.send({
			message: "chargingRecordService.js: createChargingRecord:",
			savedChargingRecord: savedChargingRecord
		});
		res.end();
	}
	catch(err){
		res.send({
			message: "chargingRecordService.js: createChargingRecord:",
			error: err.toString()
		});
		res.end();		
	}
}

async function getLastChargingRecordForRegistrationNumber(req, res, next){
	let registrationNumber = req.query["registrationNumber"];

	try{
		let chargingRecord = await chargingRecordCRUDS.getLastChargingRecordForRegistrationNumberHelper(registrationNumber);

		res.send({
			message: "chargingRecordService.js: getLastChargingRecordForRegistrationNumber:",
			chargingRecord: chargingRecord
		});
		res.end();
	}
	catch(err){
		res.send({
			message: "chargingRecordService.js: getLastChargingRecordForRegistrationNumber:",
			error: err.toString()
		});
		res.end();		
	}
}

module.exports = {
	createChargingRecord: createChargingRecord,
	getLastChargingRecordForRegistrationNumber: getLastChargingRecordForRegistrationNumber
};