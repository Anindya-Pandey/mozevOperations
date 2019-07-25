let chargingRecordCRUDS = require("./chargingRecordCRUDS.js");

async function createChargingRecord(req, res, next){
	let chargingRecord = req.body;

	try{
		let lastChargingRecord = await chargingRecordCRUDS.getLastChargingRecordForRegistrationNumberHelper(chargingRecord["registrationNumber"]);

		if(lastChargingRecord){
			let dateTimeMinutes = (chargingRecord["date"].getHours() * 60) + chargingRecord["date"].getMinutes();
			let startTimeMinutes = await getMinutesFromString(chargingRecord["startTime"]);

			if(startTimeMinutes < dateTimeMinutes){		
				chargingRecord["sno"] = lastChargingRecord["sno"] + 1;
			}
			else{
				chargingRecord["sno"] = 1;
			}
		}
		else{
			chargingRecord["sno"] = 1;
		}

		chargingRecord["startTime"] = chargingRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

		delete chargingRecord["date"];		

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