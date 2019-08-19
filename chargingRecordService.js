let chargingRecordCRUDS = require("./chargingRecordCRUDS.js");

function convertUTCToIST(utcDateTime){
	let responsePromise = new Promise(function(resolve, reject){
		try{
			let istDateTime = new Date(Date.parse(utcDateTime) + 19800000);

			resolve(istDateTime);
		}
		catch(err){
			reject("chargingRecordService.js: convertUTCToIST: " + err.toString());
		}
	});

	return responsePromise;
}

function convertISTToUTC(istDateTime){
	let responsePromise = new Promise(function(resolve, reject){
		try{
			let utcDateTime = new Date(Date.parse(istDateTime) - 19800000);

			resolve(utcDateTime);
		}
		catch(err){
			reject("chargingRecordService.js: convertISTToUTC: " + err.toString());
		}
	});

	return responsePromise;
}

async function getMinutesFromString(time){
	let responsePromise = new Promise(function(resolve, reject){
		try{
			let timeSegments = time.split(":");
			let hrs = parseInt(timeSegments[0]);
			let mnts = parseInt(timeSegments[1]);

			mnts = mnts + (hrs * 60);

			resolve(mnts);
		}
		catch(err){
			reject("chargingRecordService.js: getMinutesFromString: " + err.toString());
		}
	});

	return responsePromise;
}

async function createChargingRecord(req, res, next){
	let chargingRecord = req.body;

	chargingRecord["startDate"] = new Date(chargingRecord["startDate"]);
	chargingRecord["endDate"] = new Date(chargingRecord["endDate"]);
	chargingRecord["recordDate"] = new Date(chargingRecord["recordDate"]);

	try{
		if(
			Date.parse(chargingRecord["startDate"]) >= Date.parse(chargingRecord["recordDate"]) ||
			Date.parse(chargingRecord["endDate"]) >= Date.parse(chargingRecord["recordDate"]) ||
			Date.parse(chargingRecord["startDate"]) >= Date.parse(chargingRecord["endDate"])
		){
			res.send({
				message: "chargingRecordService.js: createChargingRecord:",
				error: "Charging start time should be before charging end time and both should be before charging end time"
			});
			res.end();
		}
		else{
			let lastChargingRecord = await chargingRecordCRUDS.getLastChargingRecordForRegistrationNumberHelper(chargingRecord["registrationNumber"]);

			if(lastChargingRecord){
				if(Date.parse(chargingRecord["startDate"]) <= Date.parse(lastChargingRecord["recordDate"])){
					res.send({
						message: "chargingRecordService.js: createChargingRecord:",
						error: "Start Time should be after Record Time of last charging record"
					});
					res.end();
				}
				else if(
					chargingRecord["startDate"].getDate() != lastChargingRecord["startDate"].getDate() ||
					chargingRecord["startDate"].getMonth() != lastChargingRecord["startDate"].getMonth() ||
					chargingRecord["startDate"].getFullYear() != lastChargingRecord["startDate"].getFullYear()
				){
					chargingRecord["sno"] = 1;
				}
				else{
					chargingRecord["sno"] = lastChargingRecord["sno"] + 1;
				}
			}
			else{
				chargingRecord["sno"] = 1;
			}

			let savedChargingRecord = await chargingRecordCRUDS.createChargingRecordHelper(chargingRecord);

			res.send({
				message: "chargingRecordService.js: createChargingRecord:",
				savedChargingRecord: savedChargingRecord
			});
			res.end();
		}
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