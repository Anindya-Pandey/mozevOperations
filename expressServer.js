let express = require("express");
let bodyParser = require("body-parser");
require("./db.js");

let tripRecordService = require("./tripRecordService.js");
let chargingRecordService = require("./chargingRecordService.js");

let app = express();

app.use(bodyParser.json());

app.post("/trip", tripRecordService.createTripRecord);
app.get("/trip/last", tripRecordService.getLastTripRecordForRegistrationNumber);

app.post("/charging", chargingRecordService.createChargingRecord);
app.get("/charging/last", chargingRecordService.getLastChargingRecordForRegistrationNumber);

app.listen("3000", function(){
	console.log("Listening on 3000");
});