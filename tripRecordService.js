let tripRecordCRUDS = require("./tripRecordCRUDS.js");

function convertUTCToIST(utcDateTime){
	let responsePromise = new Promise(function(resolve, reject){
		try{
			let istDateTime = new Date(Date.parse(utcDateTime) + 19800000);

			resolve(istDateTime);
		}
		catch(err){
			reject("tripRecordService.js: convertUTCToIST: " + err.toString());
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
			reject("tripRecordService.js: convertISTToUTC: " + err.toString());
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
			reject("tripRecordService.js: getMinutesFromString: " + err.toString());
		}
	});

	return responsePromise;
}

async function createTripRecord(req, res, next){
	let tripRecord = req.body;

	tripRecord["startDate"] = new Date(tripRecord["startDate"]);
	tripRecord["recordDate"] = new Date(tripRecord["recordDate"]);

	try{
		if(Date.parse(tripRecord["startDate"]) >= Date.parse(tripRecord["recordDate"])){
			res.send({
				message: "tripRecordService.js: createTripRecord:",
				error: "Start Time should be before Record Time"
			});
			res.end();
		}
		else{
			let lastTripRecord = await tripRecordCRUDS.getLastTripRecordForRegistrationNumberHelper(tripRecord["registrationNumber"]);

			if(lastTripRecord){
				if(Date.parse(tripRecord["startDate"]) <= Date.parse(lastTripRecord["recordDate"])){
					res.send({
						message: "tripRecordService.js: createTripRecord:",
						error: "Start Time should be after Record Time of last trip record"
					});
					res.end();
				}
				else if(
					tripRecord["startDate"].getDate() != lastTripRecord["startDate"].getDate() ||
					tripRecord["startDate"].getMonth() != lastTripRecord["startDate"].getMonth() ||
					tripRecord["startDate"].getFullYear() != lastTripRecord["startDate"].getFullYear()
				){
					tripRecord["sno"] = 1;
				}
				else{
					tripRecord["sno"] = lastTripRecord["sno"] + 1;
				}
			}
			else{
				tripRecord["sno"] = 1;
			}

			let savedTripRecord = await tripRecordCRUDS.createTripRecordHelper(tripRecord);

			res.send({
				message: "tripRecordService.js: createTripRecord:",
				savedTripRecord: savedTripRecord
			});
			res.end();
		}
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