let mongoose = require("mongoose");

let tripRecordSchema = mongoose.Schema({
	sno: Number,
	driver: String,
	registrationNumber: String,
	startDate: Date,
	recordDate: Date,
	km: Number,
	soc: Number,
	nopAtPTC: Number,
	nopAtT3: Number,
	AC: Boolean
});

let chargingRecordSchema = mongoose.Schema({
	sno: Number,
	registrationNumber: String,
	startDate: Date,
	endDate: Date,
	recordDate: Date,
	power: Number,
	startSoc: Number,
	endSoc: Number
});

let tripRecordModel = mongoose.model("triprecords", tripRecordSchema, "triprecords");
let chargingRecordModel = mongoose.model("chargingrecords", chargingRecordSchema, "chargingrecords");

module.exports = {
	tripRecordModel: tripRecordModel,
	chargingRecordModel: chargingRecordModel
};