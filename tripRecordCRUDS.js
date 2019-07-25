let dbModels = require("./dbModels.js");

function createTripRecordHelper(tripRecord){
	let responsePromise = new Promise(function(resolve, reject){
		dbModels.tripRecordModel(tripRecord).save(function(err, savedTripRecord){
			if(err){
				reject("tripRecordCRUDS.js: createTripRecordHelper: " + err.toString());
			}
			else if(savedTripRecord){
				resolve(savedTripRecord);
			}
			else{
				reject("tripRecordCRUDS.js: createTripRecordHelper: Unable to create trip record");				
			}
		});
	});

	return responsePromise;
}

function getLastTripRecordForRegistrationNumberHelper(registrationNumber){
	let responsePromise = new Promise(function(resolve, reject){
		dbModels.tripRecordModel.findOne({registrationNumber: registrationNumber}, null, {sort: {startTime: -1}}, function(err, tripRecord){
			if(err){
				reject("tripRecordCRUDS.js: getLastTripRecordForRegistrationNumberHelper: " + err.toString());				
			}
			else{
				resolve(tripRecord);
			}
		});
	});

	return responsePromise;
}

module.exports = {
	createTripRecordHelper: createTripRecordHelper,
	getLastTripRecordForRegistrationNumberHelper: getLastTripRecordForRegistrationNumberHelper
};