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

	if(!(chargingRecord["date"] instanceof Date)){
		try{
			chargingRecord["date"] = await convertUTCToIST(new Date(chargingRecord["date"].toString()));
			console.log(chargingRecord["date"]);			
		}
		catch(err){
			reject("chargingRecordService.js: createChargingRecord: " + err.toString());
		}
	}

	try{
		let lastChargingRecord = await chargingRecordCRUDS.getLastChargingRecordForRegistrationNumberHelper(chargingRecord["registrationNumber"]);

		let dateTimeMinutes = (chargingRecord["date"].getHours() * 60) + chargingRecord["date"].getMinutes();
		let startTimeMinutes = await getMinutesFromString(chargingRecord["startTime"]);
		let endTimeMinutes = await getMinutesFromString(chargingRecord["endTime"]);

		let date = await convertUTCToIST(chargingRecord["date"]);

		if(lastChargingRecord){
			if(startTimeMinutes < dateTimeMinutes){
				chargingRecord["sno"] = lastChargingRecord["sno"] + 1;
				chargingRecord["startTime"] = date.setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
				chargingRecord["endTime"] = date.setHours((endTimeMinutes / 60), (endTimeMinutes % 60), 0, 0);
			}
			else{
				chargingRecord["sno"] = 1;
				chargingRecord["startTime"] = lastChargingRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
				chargingRecord["endTime"] = date.setHours((endTimeMinutes / 60), (endTimeMinutes % 60), 0, 0);				
			}
		}
		else{
			chargingRecord["sno"] = 1;

			if(startTimeMinutes < dateTimeMinutes){
				chargingRecord["startTime"] = date.setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
				chargingRecord["endTime"] = date.setHours((endTimeMinutes / 60), (endTimeMinutes % 60), 0, 0);
			}
			else{
				let prevDate = new Date(Date.parse(chargingRecord["date"]) - 86400000);
				chargingRecord["startTime"] = prevDate.setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

				if(endTimeMinutes < startTimeMinutes){
					chargingRecord["endTime"] = date.setHours((endTimeMinutes / 60), (endTimeMinutes % 60), 0, 0);					
				}
				else{
					chargingRecord["endTime"] = prevDate.setHours((endTimeMinutes / 60), (endTimeMinutes % 60), 0, 0);					
				}
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