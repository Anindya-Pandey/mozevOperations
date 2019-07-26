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

	if(!(tripRecord["date"] instanceof Date)){
		try{
			tripRecord["date"] = await convertUTCToIST(new Date(tripRecord["date"].toString()));			
		}
		catch(err){
			reject("tripRecordService.js: createTripRecord: " + err.toString());
		}
	}

	try{
		let lastTripRecord = await tripRecordCRUDS.getLastTripRecordForRegistrationNumberHelper(tripRecord["registrationNumber"]);

		let dateTimeMinutes = (tripRecord["date"].getHours() * 60) + tripRecord["date"].getMinutes();
		let startTimeMinutes = await getMinutesFromString(tripRecord["startTime"]);

		if(lastTripRecord){
			if(startTimeMinutes < dateTimeMinutes){		
				tripRecord["sno"] = lastTripRecord["sno"] + 1;
				tripRecord["startTime"] = tripRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

			}
			else{
				tripRecord["sno"] = 1;
				tripRecord["startTime"] = lastTripRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
			}
		}
		else{
			tripRecord["sno"] = 1;

			if(startTimeMinutes < dateTimeMinutes){
				tripRecord["startTime"] = tripRecord["date"].setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);

			}
			else{
				let date = new Date(Date.parse(tripRecord["date"]) - 86400000);
				tripRecord["startTime"] = date.setHours((startTimeMinutes / 60), (startTimeMinutes % 60), 0, 0);
			}
		}

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