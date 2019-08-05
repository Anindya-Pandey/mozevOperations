let dbModels = require("./dbModels.js");

function createChargingRecordHelper(chargingRecord){
	let responsePromise = new Promise(function(resolve, reject){
		dbModels.chargingRecordModel(chargingRecord).save(function(err, savedChargingRecord){
			if(err){
				reject("chargingRecordCRUDS.js: createChargingRecordHelper: " + err.toString());
			}
			else if(savedChargingRecord){
				resolve(savedChargingRecord);
			}
			else{
				reject("chargingRecordCRUDS.js: createChargingRecordHelper: Unable to create charging record");				
			}
		});
	});

	return responsePromise;
}

function getLastChargingRecordForRegistrationNumberHelper(registrationNumber){
	let responsePromise = new Promise(function(resolve, reject){
		dbModels.chargingRecordModel.findOne({registrationNumber: registrationNumber}, null, {sort: {startDate: -1}}, function(err, chargingRecord){
			if(err){
				reject("chargingRecordCRUDS.js: getLastChargingRecordForRegistrationNumberHelper: " + err.toString());				
			}
			else{
				resolve(chargingRecord);
			}
		});
	});

	return responsePromise;
}

module.exports = {
	createChargingRecordHelper: createChargingRecordHelper,
	getLastChargingRecordForRegistrationNumberHelper: getLastChargingRecordForRegistrationNumberHelper
};