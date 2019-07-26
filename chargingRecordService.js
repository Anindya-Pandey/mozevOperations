let chargingRecordCRUDS = require("./chargingRecordCRUDS.js");

async function createChargingRecord(req, res, next){
	let chargingRecord = req.body;

	if(!(chargingRecord["date"] instanceof Date)){
		try{
			chargingRecord["date"] = await convertUTCToIST(new Date(chargingRecord["date"].toString()));			
		}
		catch(err){
			reject("chargingRecordService.js: createChargingRecord: " + err.toString());
		}
	}
	
	try{
		let lastChargingRecord = await chargingRecordCRUDS.getLastChargingRecordForRegistrationNumberHelper(chargingRecord["registrationNumber"]);

		let dateTimeMinutes = (chargingRecord["date"].getHours() * 60) + chargingRecord["date"].getMinutes();
		let startTimeMinutes = await getMinutesFromString(chargingRecord["startTime"]);

		if(lastChargingRecord){
			if(startTimeMinutes < dateTimeMinutes){		
				chargingRecord["sno"] = lastChargingRecord["sno"] + 1;
				chargingRecord["startTime"] = chargingRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

			}
			else{
				chargingRecord["sno"] = 1;
				chargingRecord["startTime"] = lastChargingRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
			}
		}
		else{
			chargingRecord["sno"] = 1;

			if(startTimeMinutes < dateTimeMinutes){
				chargingRecord["startTime"] = chargingRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

			}
			else{
				let date = new Date(Date.parse(chargingRecord["date"]) - 86400000);
				chargingRecord["startTime"] = date.setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
			}
		}

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